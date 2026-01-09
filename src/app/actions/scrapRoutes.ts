'use server';

import { ALLCLIMB_URL } from '@/shared/constants/allclimb';
import { db } from '@/lib/db/index'; // Импорт Drizzle DB
import { regions, places, sectors, routes, settings } from '@/lib/db/schema';
import { preparePlaces, prepareSectors, prepareRoutes } from './scrapRoutes-utils';
import chunkArray from '@/shared/utils/chunkArray';
import { formatDuration } from '@/shared/utils/formatDuration';
import type { IPlace, IRoute, IScrapStats, ISector } from '@/lib/db/schema';

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
          throw `${response.status} ${response.statusText}`;
        } else {
          const text = await response.text();
          try {
            data = text ? JSON.parse(text) : {};
          } catch (e) {
            console.log('JSON.parse(text) error: ', text);
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
      ? result.map((el: any) => ({
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
    if (loadedRegions.length > 0) {
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
        fetchErrors.regions.push(region.name);
      }
    });

    await Promise.all(placesDataPromises);
    console.log('мест: ', loadedPlaces.length);

    // Сохранение мест
    if (loadedPlaces.length > 0) {
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
            loadedSectors.push(...placeSectors);
            console.log('загрузка мест, секторов: ', loadedSectors.length);
          } catch (err) {
            fetchErrors.places.push(place.name);
          }

          await new Promise((resolve) => setTimeout(resolve, 200));
        })
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Сохранение секторов
    if (loadedSectors.length > 0) {
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
            sectorRoutes = await db.insert(routes).values(sectorRoutes).returning();
            loadedRoutes.push(...sectorRoutes);
          } catch (err) {
            fetchErrors.sectors.push(sector.name);
          }
          console.log('загрузка секторов, трасс: ', loadedRoutes.length);
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
      ошибки загрузки данных для регионов: ${stats.regionsErrors} / ${stats.regions}
      ошибки загрузки данных для мест: ${stats.placesErrors} / ${stats.places}
      ошибки загрузки данных для секторов: ${stats.sectorsErrors} / ${stats.sectors}
      трасс загружено: ${loadedRoutes.length}
    `);

    // Обновление статистики в БД
    await db
      .insert(settings)
      .values({ scrapStats: stats })
      .onConflictDoUpdate({
        target: settings.id,
        set: { scrapStats: stats },
      });

    return stats;
  } catch (error) {
    console.error('Ошибка на загрузке данных с Allclimb: ', error);
    throw new Error('Ошибка на загрузке данных с Allclimb');
  }
}
