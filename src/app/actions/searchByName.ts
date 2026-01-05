import { getDatabase } from '@/lib/database';
import { Place, Route, Sector } from '@/models';

export async function searchByName(query: string) {
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
        .select(['place.id', 'place.name', 'place.link'])
        .where('LOWER(place.name) LIKE LOWER(:searchTerm)', { searchTerm })
        .getMany(),

      sectorRepo.createQueryBuilder('sector')
        .select(['sector.id', 'sector.name', 'sector.link'])
        .where('LOWER(sector.name) LIKE LOWER(:searchTerm)', { searchTerm })
        .getMany(),

      routeRepo.createQueryBuilder('route')
        .select(['route.id', 'route.name', 'route.uniqId', 'route.sectorId', 'sector.link'])
        .innerJoin('route.sector', 'sector')
        .where('LOWER(route.name) LIKE LOWER(:searchTerm)', { searchTerm })
        .getMany(),
    ]);

    return {
      places: places.map(({ id, name, link }: { id: string; name: string; link: string }) => ({ id, name, link })),
      sectors: sectors.map(({ id, name, link }: { id: string; name: string; link: string }) => ({ id, name, link })),
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