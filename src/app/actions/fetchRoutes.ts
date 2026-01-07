'use server';
import { getDatabase } from '@/lib/database';
import { Route } from '@/models/Route';
import type { IRoute } from '@/shared/types/IRoute';

export async function fetchRoutes<T extends keyof IRoute>(whereParams: Partial<Record<T, IRoute[T]>>): Promise<IRoute[]> {
  const where = whereParams || {};
  const { getRepository } = await getDatabase();
  const routeRepo = getRepository(Route);
  
  const routes = await routeRepo.find({
    where,
    order: {
      name: 'ASC',
    },
  });
  return routes;
}

