'use server';

import { ALLCLIMB_URL } from '@/shared/constants/allclimb.constants';
import { db } from '@/lib/db/index';
import { migrateToRemote } from '@/lib/db/migrate';
import { regions, places, sectors, routes } from '@/lib/db/schema';
import { count } from 'drizzle-orm';
import { preparePlaces, prepareSectors, prepareRoutes } from './scrapRoutes-utils';
import chunkArray from '@/shared/utils/chunkArray';
import { formatDuration } from '@/shared/utils/formatDuration';
import type { IRegion, IPlace, IRoute, IScrapStats, ISector } from '@/lib/db/schema';
import { SettingsService } from '@/lib/services/settings.service';

interface FetchErrors {
  regions: string[];
  places: string[];
  sectors: string[];
}

const BATCH_SIZE = 1;
const MAX_ERRORS = 1;

function randomDelay(min = 1500, max = 2000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function resetTables() {
    await db.delete(routes);
    await db.delete(sectors);
    await db.delete(places);
    await db.delete(regions);
    console.warn('очистка таблиц в бд завершенна')
}

export async function scrapRoutes() {
  try {
    const startTime = new Date();

    const getApiResponse = async (url: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
        },
        // body: JSON.stringify({ data: '' }),
        body: 'act=eyJ2IjoxfQ:1x4ZAU:MwNZg_kGfSnBcEzb8mFCwLPg6ekaAZaWE3Z-4GzFMaU',
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

    const fetchErrors: FetchErrors = {
      regions: [],
      places: [],
      sectors: [],
    };

    // Получаем регионы
    let loadedRegions: IRegion[] = await db.select().from(regions);

    if (!loadedRegions.length) {
      const { data: { result } } = await getApiResponse(`${ALLCLIMB_URL}/ru/guides/`);
      loadedRegions = result
        ? result.map((el: { [key: string]: unknown; }) => ({
            uniqId: `${el.country}/${el.name}`,
            name: el.name,
            country: el.country,
            season: el.season || null,
            link: el.web_guide_link,
          }))
        : [];
      // Очистка таблиц
      await resetTables();

      // Сохранение регионов
      if (loadedRegions.length) {
        loadedRegions = await db.insert(regions).values(loadedRegions).returning();
      }
      console.log('загруженно регионов: ', loadedRegions.length);
    } else {
      console.log('регионов в базе: ', loadedRegions.length);
    }    

    const regionCounts = await db
      .select({
        regionId: places.regionId,
        count: count(places.id).as('count')
      })
      .from(places)
      .groupBy(places.regionId);

    const regionCountsMap = regionCounts.reduce<Record<string, number>>((acc, item) => {
      acc[item.regionId + ''] = item.count;
      return acc;
    }, {});

    // console.log('regionCounts: ', regionCounts);

    // Загрузка мест
    const regionChunks = chunkArray(loadedRegions, BATCH_SIZE);
    let loadedPlaces: IPlace[] = [];

    for (const regionChunk of regionChunks) {
      await Promise.all(
        regionChunk.map(async (region) => {
          if (!region.link) return;

          // если уже есть места для этого района - пропускаем
          // console.log(`regionCountsMap[${region.id}]: `, regionCountsMap[region.id]);
          if (regionCountsMap[region.id] !== undefined) return;

          try {
            const { data } = await getApiResponse(`${ALLCLIMB_URL}${region.link}`);
            const regionPlaces = preparePlaces(data, region.id!, region.uniqId);
            loadedPlaces.push(...(regionPlaces as IPlace[]));            
          } catch (err) {
            console.log('error: ', err);
            fetchErrors.places.push(region.link);
          }
          console.log(`загрузка региона ${region.link}, загруженно мест: `, loadedPlaces.length);
          await new Promise((resolve) => setTimeout(resolve, randomDelay()));
        })
      );
      // await new Promise((resolve) => setTimeout(resolve, 300));
    }


    console.log('загруженно новых мест: ', loadedPlaces.length);
    // Сохранение мест
    if (loadedPlaces.length) {
      console.log('Сохранение мест: ', loadedPlaces.length)
      loadedPlaces = await db.insert(places).values(loadedPlaces).returning();
    }
    const totalPlaces = await db.select().from(places);
    console.log('мест в базе: ', totalPlaces.length);


    // Загрузка секторов
    const placeChunks = chunkArray(loadedPlaces.length ? loadedPlaces : totalPlaces, BATCH_SIZE);
    const placesCounts = await db
      .select({
        placeId: sectors.placeId,
        count: count(sectors.id).as('count')
      })
      .from(sectors)
      .groupBy(sectors.placeId);

    const placesCountsMap = placesCounts.reduce<Record<string, number>>((acc, item) => {
      acc[item.placeId + ''] = item.count;
      return acc;
    }, {});

    // console.log('placesCountsMap: ', placesCountsMap);

    let loadedSectors: ISector[] = [];

    for (const placeChunk of placeChunks) {
      await Promise.all(
        placeChunk.map(async (place) => {
          if (!place.link) return;

          if (fetchErrors.places.length > MAX_ERRORS) return;

          // если уже есть сектора для этого места - пропускаем
          // console.log(`placesCountsMap[${place.id}]: `, placesCountsMap[place.id]);
          if (placesCountsMap[place.id] !== undefined) return;

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
          console.log(`загрузка места ${place.link}, загруженно секторов: `, loadedSectors.length);
          await new Promise((resolve) => setTimeout(resolve, randomDelay()));
        })
      );
      // await new Promise((resolve) => setTimeout(resolve, 300));
    }


    console.log('загруженно новых секторов: ', loadedSectors.length);
    // Сохранение секторов
    if (loadedSectors.length) {
      loadedSectors = await db.insert(sectors).values(loadedSectors).returning();
    }
    const totalSectors = await db.select().from(sectors);
    console.log('секторов в базе: ', totalSectors.length);


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
          console.log('загрузка трасс, загруженно: ', loadedRoutes.length);
          await new Promise((resolve) => setTimeout(resolve, randomDelay()));
        })
      );
      // await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Обновление статистики
    const endTime = new Date();
    const stats: IScrapStats = {
      regions: loadedRegions.length,
      regionsErrors: fetchErrors.regions.length,
      places: totalPlaces.length,
      placesErrors: fetchErrors.places.length,
      sectors: totalSectors.length,
      sectorsErrors: fetchErrors.sectors.length,
      routes: loadedRoutes.length,
      scrapDate: endTime.toLocaleDateString('ru-RU'),
      scrapDuration: formatDuration(startTime, endTime),
    };

    migrateToRemote();

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
