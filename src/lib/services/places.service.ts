import { db } from '@/lib/db';
import { places } from '@/lib/db/schema';
import { and, eq, asc } from 'drizzle-orm';

export type PlaceFilters = Partial<{
  regionId: number;
}>;

export class PlacesService {
  // Поиск трасс по фильтру
  static async find(filters: PlaceFilters = {}) {
    const conditions = [];
    if (filters.regionId) {
      conditions.push(eq(places.regionId, filters.regionId));
    }
    
    const whereClause = conditions.length > 0 
      ? and(...conditions) 
      : undefined;
    
    return await db
      .select()
      .from(places)
      .where(whereClause)
      .orderBy(asc(places.id));
  }

  // Поиск региона по id
  static async findOne(id: number) {
    const [place] = await db
      .select()
      .from(places)
      .where(eq(places.id, id))
      .limit(1);
    
    return place || null;
  }
}