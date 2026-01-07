'use server';
import { getDatabase } from '@/lib/database';
import { Region } from '@/models/Region';
import type { IRegion } from '@/shared/types/IRegion';

export async function fetchRegions(): Promise<IRegion[]> {
  const { getRepository } = await getDatabase();
  const regionRepo = getRepository(Region);
  
  const regions = await regionRepo.find({
    order: {
      country: 'ASC',
      name: 'ASC',
    },
  });
  return regions;
}

