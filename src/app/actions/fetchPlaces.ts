'use server';
import { getDatabase } from '@/lib/database';
import { Place } from '@/models/Place';
import type { IPlace } from '@/shared/types/IPlace';

export async function fetchPlaces<T extends keyof IPlace>(whereParams: Partial<Record<T, IPlace[T]>>): Promise<IPlace[]> {
  const where = whereParams || {};
  const { getRepository } = await getDatabase();
  const placeRepo = getRepository(Place);
  
  const places = await placeRepo.find({
    where,
    order: {
      name: 'ASC',
    },
  });
  return places;
}

