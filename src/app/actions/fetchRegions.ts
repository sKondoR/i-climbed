'use server';
import { getDatabase } from '@/lib/database';
import { Region } from '@/models';
import type { IRegion } from '@/shared/types/IRegion';

export async function fetchRegions(): Promise<IRegion[]> {
  const { getRepository } = await getDatabase();
  const regionRepo = getRepository(Region);
  
  const regions = await regionRepo.find({
    relations: {
      children: true,
    },
    order: {
      country: 'ASC',
      name: 'ASC',
    },
  });
  console.log('fetchRegions: ', regions[0]);
  return regions;
}

