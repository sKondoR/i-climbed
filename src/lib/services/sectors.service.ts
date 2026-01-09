import { db } from '@/lib/db';
import { sectors } from '@/lib/db/schema';
import { and, eq, ilike, asc } from 'drizzle-orm';

export type SectorFilters = Partial<{
  placeId: number;
}>;

export class SectorsService {
  // Поиск трасс по фильтру
  static async find(filters: SectorFilters = {}) {
    const conditions = [];
    if (filters.placeId) {
      conditions.push(eq(sectors.placeId, filters.placeId));
    }
    
    const whereClause = conditions.length > 0 
      ? and(...conditions) 
      : undefined;
    
    return await db
      .select()
      .from(sectors)
      .where(whereClause)
      .orderBy(asc(sectors.id));
  }

  // Поиск региона по id
  static async findOne(id: number) {
    const [sector] = await db
      .select()
      .from(sectors)
      .where(eq(sectors.id, id))
      .limit(1);
    
    return sector || null;
  }
}