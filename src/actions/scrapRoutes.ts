'use server';

import { ALLCLIMB_URL } from '@/shared/constants/allclimb.constants';
import { db } from '@/lib/db/index';
import { regions, places, sectors, routes } from '@/lib/db/schema';
import { preparePlaces, prepareSectors, prepareRoutes } from './scrapRoutes-utils';
import chunkArray from '@/shared/utils/chunkArray';
import { formatDuration } from '@/shared/utils/formatDuration';
import type { IPlace, IRoute, IScrapStats, ISector } from '@/lib/db/schema';
import { SettingsService } from '@/lib/services/settings.service';

interface FetchErrors {
  regions: string[];
  places: string[];
  sectors: string[];
}
export async function scrapRoutes() {
  try {
    const startTime = new Date();

    const getApiResponse = async (url: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ data: '' }),
      });
      let data;
      try {
        if (response.status !== 200) {
          throw new Error(`Failed to parse response as JSON: ${response.status} ${response.statusText}`);
        } else {
          const text = await response.text();
          try {
            data = text ? JSON.parse(text) : {};
          } catch (err) {
            console.log('JSON.parse(text) error: ', err);
          }
        }
      } catch (e) {
        console.log('error: ', e);
        throw new Error(`Failed to parse response as JSON: ${response.status} ${response.statusText}`);
      }

      return {
        status: response.status,
        data,
      };
    };

    // Получаем регионы
    const { data: { result } } = await getApiResponse(`${ALLCLIMB_URL}/ru/guides/`);
    let loadedRegions: (typeof regions.$inferInsert)[] = result
      ? result.map((el: { [key: string]: unknown; }) => ({
          uniqId: `${el.country}/${el.name}`,
          name: el.name,
          country: el.country,
          season: el.season || null,
          link: el.web_guide_link,
        }))
      : [];

    const fetchErrors: FetchErrors = {
      regions: [],
      places: [],
      sectors: [],
    };

    // Очистка таблиц
    await db.delete(routes);
    await db.delete(sectors);
    await db.delete(places);
    await db.delete(regions);

    // Сохранение регионов
    if (loadedRegions.length) {
      loadedRegions = await db.insert(regions).values(loadedRegions).returning();
    }
    console.log('регионов: ', loadedRegions.length);

    // Загрузка мест
    let loadedPlaces: IPlace[] = [];
    const placesDataPromises = loadedRegions.map(async (region) => {
      try {
        const { data } = await getApiResponse(`${ALLCLIMB_URL}${region.link}`);
        const regionPlaces = preparePlaces(data, region.id!, region.uniqId);
        loadedPlaces.push(...(regionPlaces as IPlace[]));
      } catch (err) {
        console.log('error: ', err);
        fetchErrors.regions.push(region.link);
      }
    });

    await Promise.all(placesDataPromises);
    console.log('мест: ', loadedPlaces.length);

    // Сохранение мест
    if (loadedPlaces.length) {
      loadedPlaces = await db.insert(places).values(loadedPlaces).returning();
    }

    // Загрузка секторов
    const BATCH_SIZE = 50;
    const placeChunks = chunkArray(loadedPlaces, BATCH_SIZE);
    let loadedSectors: ISector[] = [];

    for (const placeChunk of placeChunks) {
      await Promise.all(
        placeChunk.map(async (place) => {
          if (!place.link) return;

          try {
            const { data } = await getApiResponse(`${ALLCLIMB_URL}${place.link}`);
            const placeSectors = prepareSectors(data, place.id, place.uniqId);
            if (Array.isArray(placeSectors) && placeSectors.length) {
              loadedSectors.push(...placeSectors);
            }            
          } catch (err) {
            console.log('error: ', err);
            fetchErrors.places.push(place.link);
          }
          console.log('загрузка мест, секторов полученно: ', loadedSectors.length);
          await new Promise((resolve) => setTimeout(resolve, 200));
        })
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Сохранение секторов
    if (loadedSectors.length) {
      loadedSectors = await db.insert(sectors).values(loadedSectors).returning();
    }
    console.log('секторов: ', loadedSectors.length);

    // Загрузка маршрутов
    const sectorsChunks = chunkArray(loadedSectors, BATCH_SIZE);
    const loadedRoutes: IRoute[] = [];

    for (const sectorsChunk of sectorsChunks) {
      await Promise.all(
        sectorsChunk.map(async (sector) => {
          if (!sector.link) return;

          try {
            const { data } = await getApiResponse(`${ALLCLIMB_URL}${sector.link}`);
            let sectorRoutes = prepareRoutes(data, sector.id, sector.uniqId);
            if (Array.isArray(sectorRoutes) && sectorRoutes.length) {
              sectorRoutes = await db.insert(routes).values(sectorRoutes).returning();
              loadedRoutes.push(...sectorRoutes);              
            }
          } catch (err) {
            console.log('error: ', err);
            fetchErrors.sectors.push(sector.link);
          }
          console.log('загрузка секторов, трасс полученно: ', loadedRoutes.length);
          await new Promise((resolve) => setTimeout(resolve, 200));
        })
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Обновление статистики
    const endTime = new Date();
    const stats: IScrapStats = {
      regions: loadedRegions.length,
      regionsErrors: fetchErrors.regions.length,
      places: loadedPlaces.length,
      placesErrors: fetchErrors.places.length,
      sectors: loadedSectors.length,
      sectorsErrors: fetchErrors.sectors.length,
      routes: loadedRoutes.length,
      scrapDate: endTime.toLocaleDateString('ru-RU'),
      scrapDuration: formatDuration(startTime, endTime),
    };

    console.log(`
      ошибки загрузки данных для регионов: ${stats.regionsErrors} из ${stats.regions}
      ошибки загрузки данных для мест: ${stats.placesErrors} из ${stats.places}
      ошибки загрузки данных для секторов: ${stats.sectorsErrors} из ${stats.sectors}
      трасс загружено: ${loadedRoutes.length}
    `);

    console.log(`сектора с ошибками: ${fetchErrors.sectors.join(', ')}`);

    await SettingsService.updateScrapStats(stats);

    return stats;
  } catch (error) {
    console.error('Ошибка на загрузке данных с Allclimb: ', error);
    throw new Error('Ошибка на загрузке данных с Allclimb');
  }
}
