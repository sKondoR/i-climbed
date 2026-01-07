'use server';
import { getDatabase } from '@/lib/database';
import { Sector } from '@/models/Sector';
import type { ISector } from '@/shared/types/ISector';

export async function fetchSectors<T extends keyof ISector>(whereParams: Partial<Record<T, ISector[T]>>): Promise<ISector[]> {
  const where = whereParams || {};
  const { getRepository } = await getDatabase();
  const sectorRepo = getRepository(Sector);
  
  const sectors = await sectorRepo.find({
    where,
    order: {
      name: 'ASC',
    },
  });
  return sectors;
}

