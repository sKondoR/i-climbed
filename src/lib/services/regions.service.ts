import { db } from '@/lib/db';
import { regions } from '@/lib/db/schema';
import { and, eq, ilike, asc } from 'drizzle-orm';

export type RegionsFilters = Partial<{
  name: string;
}>;

export class RegionsService {
  // Поиск регионов по фильтру
  static async find(filters: RegionsFilters = {}) {
    const conditions = [];
    if (filters.name) {
      conditions.push(ilike(regions.name, `%${filters.name}%`));
    }
    
    const whereClause = conditions.length > 0 
      ? and(...conditions) 
      : undefined;
    
    return await db
      .select()
      .from(regions)
      .where(whereClause)
      .orderBy(asc(regions.id));
  }

  // Поиск региона по id
  static async findOne(id: number) {
    const [region] = await db
      .select()
      .from(regions)
      .where(eq(regions.id, id))
      .limit(1);
    
    return region || null;
  }
}