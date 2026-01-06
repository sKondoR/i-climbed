'use server';
import { getDatabase } from '@/lib/database';
import { Route } from '@/models';
import type { IRoute } from '@/shared/types/IRoute';

export async function fetchRoute<T extends keyof IRoute>(
  whereParams: Partial<Record<T, IRoute[T]>>
): Promise<IRoute | null> {  
  const where = whereParams || {};
  const { getRepository } = await getDatabase();
  const routeRepo = getRepository(Route);
  
  const route = await routeRepo.findOne({
    where,
    order: {
      name: 'ASC',
    },
  });

  return route ? { ...route } : null;
}

