import { db } from '@/lib/db';
import { places, sectors, routes } from '@/lib/db/schema';
import { initialSearchResults } from '@/shared/constants/search.constants';
import type { FoundResults } from '@/shared/types/SearchResults.types';
import { eq, ilike } from 'drizzle-orm';

export class SearchService {
  static async searchByName(query: string): Promise<FoundResults | []> {
    if (!query || query.trim() === '') {
      return initialSearchResults;
    }
  
    const searchTerm = `%${query.trim()}%`;
  
    try {
      const [foundPlaces, foundSectors, foundRoutes] = await Promise.all([
        // Search in places
        db
          .select({
            id: places.id,
            name: places.name,
            uniqId: places.uniqId,
            link: places.link,
          })
          .from(places)
          .where(ilike(places.name, searchTerm)),
  
        // Search in sectors
        db
          .select({
            id: sectors.id,
            name: sectors.name,
            uniqId: sectors.uniqId,
            link: sectors.link,
          })
          .from(sectors)
          .where(ilike(sectors.name, searchTerm)),
  
        // Search in routes + join sector for link
        db
          .select({
            id: routes.id,
            name: routes.name,
            uniqId: routes.uniqId,
            sectorLink: sectors.link,
          })
          .from(routes)
          .innerJoin(sectors, eq(routes.sectorId, sectors.id))
          .where(ilike(routes.name, searchTerm)),
      ]);
  
      return {
        places: foundPlaces,
        sectors: foundSectors,
        routes: foundRoutes,
      };
    } catch (error) {
      console.error('Ошибка поиска по имени: ', error);
      throw new Error('Ошибка поиска по имени');
    }
}
}