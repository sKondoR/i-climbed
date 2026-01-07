import { getDatabase } from '@/lib/database';
import { Place } from '@/models/Place';
import { Sector } from '@/models/Sector';
import { Route } from '@/models/Route';
import type { FoundResults } from '@/shared/types/SearchResults';

export async function searchByName(query: string): Promise<FoundResults | []> {
  if (!query || query.trim() === '') {
    return [];
  }

  const { getRepository } = await getDatabase();

  const searchTerm = `%${query.trim()}%`;

  const placeRepo = getRepository(Place);
  const sectorRepo = getRepository(Sector);
  const routeRepo = getRepository(Route);

  try {
    const [places, sectors, routes] = await Promise.all([
      placeRepo.createQueryBuilder('place')
        .select(['place.id', 'place.name', 'place.uniqId', 'place.link'])
        .where('LOWER(place.name) LIKE LOWER(:searchTerm)', { searchTerm })
        .getMany(),

      sectorRepo.createQueryBuilder('sector')
        .select(['sector.id', 'sector.name', 'sector.uniqId', 'sector.link'])
        .where('LOWER(sector.name) LIKE LOWER(:searchTerm)', { searchTerm })
        .getMany(),

      routeRepo.createQueryBuilder('route')
        .select(['route.id', 'route.name', 'route.uniqId', 'route.sectorId', 'sector.link'])
        .innerJoin('route.sector', 'sector')
        .where('LOWER(route.name) LIKE LOWER(:searchTerm)', { searchTerm })
        .getMany(),
    ]);

    return {
      places: places.map(({ id, name, uniqId, link }) => ({ id, name, uniqId, link })),
      sectors: sectors.map(({ id, name, uniqId, link }) => ({ id, name, uniqId, link })),
      routes: routes.map(({ id, name, uniqId, sector }) => ({
        id,
        name,
        uniqId,
        sectorLink: sector.link,
      })),
    };
  } catch (error) {
    console.error('Ошибка поиска по имени: ', error);
    throw new Error('Ошибка поиска по имени');
  }
}