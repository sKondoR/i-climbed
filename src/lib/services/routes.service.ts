import { db } from '@/lib/db';
import { routes } from '@/lib/db/schema';
import { and, eq, asc } from 'drizzle-orm';

export type RouteFilters = Partial<{
  sectorId: number;
}>;

export class RoutesService {
  // Поиск трасс по фильтру
  static async find(filters: RouteFilters = {}) {
    const conditions = [];
    if (filters.sectorId) {
      conditions.push(eq(routes.sectorId, filters.sectorId));
    }
    
    const whereClause = conditions.length > 0 
      ? and(...conditions) 
      : undefined;
    
    return await db
      .select()
      .from(routes)
      .where(whereClause)
      .orderBy(asc(routes.id));
  }

  // Поиск региона по id
  static async findOne(id: number) {
    const [route] = await db
      .select()
      .from(routes)
      .where(eq(routes.id, id))
      .limit(1);
    
    return route || null;
  }
}