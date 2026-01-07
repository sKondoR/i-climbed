'use server';
import { ALLCLIMB_URL } from '@/shared/constants/allclimb';
import { getDatabase } from '@/lib/database';
import { Region } from '@/models/Region';
import { Place } from '@/models/Place';
import { Sector } from '@/models/Sector';
import { Route } from '@/models/Route';
import { preparePlaces, prepareRoutes, prepareSectors } from './scrapRoutes-utils';
import chunkArray from '@/shared/utils/chunkArray';
import { formatDuration } from '@/shared/utils/formatDuration';
import { updateScrapStats } from './updateScrapStats';

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
          data = text ? JSON.parse(text) : {};          
        }
      } catch (e) {
        console.log('error: ', e)
        throw new Error(`Failed to parse response as JSON: ${response.status} ${response.statusText}`);
      }

      return {
        status: response.status,
        data
      };
    };

    const { data: { result } } = await getApiResponse(`${ALLCLIMB_URL}/ru/guides/`);
    let loadedRegions = result ? result.map((el: any) => ({
      ...el,
      uniqId: `${el.country}/${el.name}`,
      link: el.web_guide_link,
    })) : [];

    const { getRepository } = await getDatabase();
    const regionRepo = getRepository(Region);
    const placeRepo = getRepository(Place);
    const sectorRepo = getRepository(Sector);
    const routeRepo = getRepository(Route);
    // полностью чистим таблицы от старых данных
    await routeRepo.createQueryBuilder().delete().from(Route).execute();
    await sectorRepo.createQueryBuilder().delete().from(Sector).execute();
    await placeRepo.createQueryBuilder().delete().from(Place).execute();
    await regionRepo.createQueryBuilder().delete().from(Region).execute();

    const fetchErrors: FetchErrors = {
      regions: [],
      places: [],
      sectors: [],
    };
    
    // Сохраняем загруженные регионы
    loadedRegions = await regionRepo.save(loadedRegions);
    console.log('регионов: ', loadedRegions.length);

    let loadedPlaces: Place[] = [];
    const placesDataPromises = loadedRegions.map(async (region: Region, i: number) => {
      try {
        const { data } = await getApiResponse(`${ALLCLIMB_URL}${region.link}`);
        const regionPlaces = preparePlaces(data, region.id, region.uniqId);    
        loadedPlaces.push(...regionPlaces);         
      } catch (err) {
        fetchErrors.regions.push(region.name);
      }
      return region;
    });

    // Дожидаемся всех запросов
    await Promise.all(placesDataPromises);

    const withoutRegionId = loadedPlaces.filter((el: any) => !el.regionId);
    console.log('потерян regionId', withoutRegionId);

    // Сохраняем загруженные места региона
    await placeRepo.save(loadedPlaces);
    console.log('мест: ', loadedPlaces.length);

    const BATCH_SIZE = 50;

    const placeChunks = chunkArray(loadedPlaces, BATCH_SIZE);
    const loadedSectors: Sector[] = [];
    for (const placeChunk of placeChunks) {
      await Promise.all(
        placeChunk.map(async (place: Place) => {
          if (!place.link) return;

          try {
            const { data } = await getApiResponse(`${ALLCLIMB_URL}${place.link}`);
            const placeSectors = prepareSectors(data, place.id, place.uniqId);
            loadedSectors.push(...placeSectors);
            console.log('загрузка мест, секторов: ', loadedSectors.length);
          } catch (err) {
            fetchErrors.places.push(place.name);
          }

          // Задержка между запросами
          await new Promise(resolve => setTimeout(resolve, 50));
        })
      );

      // Небольшая задержка между пакетами, чтобы не перегружать сервер
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const withoutPlaceId = loadedSectors.filter((el: any) => !el.placeId);
    console.log('потерян placeId', withoutPlaceId.length);

    // Сохраняем загруженные сектора
    await sectorRepo.save(loadedSectors);
    console.log('секторов: ', loadedSectors.length);

    const sectorsChunks = chunkArray(loadedSectors, BATCH_SIZE);
    const loadedRoutes: Route[] = [];
    for (const sectorsChunk of sectorsChunks) {
      await Promise.all(
        sectorsChunk.map(async (sector: Sector) => {
          if (!sector.link) return;

          try {
            const { data } = await getApiResponse(`${ALLCLIMB_URL}${sector.link}`);
            const sectorRoutes = prepareRoutes(data, sector.id, sector.uniqId);
            loadedRoutes.push(...sectorRoutes);
            // if (sectorRoutes.length === 0) {
            //   console.log('нет трасс для сектора: ', sector.link);
            // }        
            await routeRepo.save(sectorRoutes);    
          } catch (err) {
            fetchErrors.sectors.push(sector.name);
          }

          // Задержка между запросами
          await new Promise(resolve => setTimeout(resolve, 50));
        })
      );

      // Небольшая задержка между пакетами, чтобы не перегружать сервер
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const endTime = new Date();
    const stats = {
      regions: loadedRegions.length,
      regionsErrors: fetchErrors.regions.length,
      places: loadedPlaces.length,
      placesErrors: fetchErrors.places.length,
      sectors: loadedSectors.length,
      sectorsErrors: fetchErrors.sectors.length,
      routes: loadedRoutes.length,
      scrapDate: endTime.toLocaleDateString('ru-RU'),
      scrapDuration: formatDuration(startTime, endTime)
    }
    console.log(`
      ошибки загрузки данных для регионов: ${stats.regionsErrors} / ${stats.regions}
      ошибки загрузки данных для мест: ${stats.placesErrors} / ${stats.places}
      ошибки загрузки данных для секторов: ${stats.sectorsErrors} / ${stats.sectors}
      трасс загруженно: ${loadedRoutes.length}
    `)
    updateScrapStats(stats);
  } catch (error) {
    console.error('Ошибка на загрузке данных с Allclimb: ', error);
    throw new Error('Ошибка на загрузке данных с Allclimb');
  } finally {
  }
}