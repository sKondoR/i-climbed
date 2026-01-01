'use server';

import { ALLCLIMB_URL } from '@/shared/constants/allclimb';
import { getDatabase } from '@/lib/database';
import { Place, Region } from '@/models';
import { preparePlaces } from './scrapRoutes-utils';

export async function scrapRoutes() {
  try {
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
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error(`Failed to parse response as JSON: ${response.status} ${response.statusText}`);
      }

      return {
        status: response.status,
        data
      };
  };

    const { data: { result } } = await getApiResponse(`${ALLCLIMB_URL}/guides/`);
    const results = result ? result.map((el: any) => ({
      ...el,
      uniqId: `${el.country}/${el.name}`,
      link: el.web_guide_link,
      children: [],
    })) : [];
    

    const { getRepository } = await getDatabase();
    const regionRepo = getRepository(Region);
    const placeRepo = getRepository(Place);
    await placeRepo.createQueryBuilder().delete().from(Place).execute();
    await regionRepo.createQueryBuilder().delete().from(Region).execute();

    await regionRepo.createQueryBuilder().delete().execute();
    await regionRepo.save(results);

    const placesResult: Place[] = [];
    const placesDataPromises = results.map(async (region: Region) => {
      try {
        const { data } = await getApiResponse(`${ALLCLIMB_URL}/guides/${region.name}/`);
        const regionPlaces = preparePlaces(data, region.id, region.uniqId); 
        placesResult.push(...regionPlaces);
        region.children = regionPlaces;           
      } catch (err) {
        console.error(`Failed to fetch details for ${region.name}:`, err);
        region.children = [];
      }
      return region;
    });

    // Дожидаемся всех запросов
    await Promise.all(placesDataPromises);
    
    // Теперь можно обновить БД с данными о местах
    await regionRepo.save(results); // повторное сохранение с обновлёнными `places`
    console.log(placesResult[0]);
    await placeRepo.save(placesResult);
    
    return results;
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    throw new Error('Capture failed');
  } finally {
  }
}