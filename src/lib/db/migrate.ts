import { db } from '@/lib/db/index';
import { remoteDd } from '@/lib/db/remote-db';
import { regions, places, sectors, routes } from '@/lib/db/schema';

export async function migrateToRemote() {
    // await remoteDd.delete(routes);
    // await remoteDd.delete(sectors);
    // await remoteDd.delete(places);
    // await remoteDd.delete(regions);

    const existedRegions = await db.select().from(regions);
    await remoteDd.insert(regions).values(existedRegions);

    const existedPlaces = await db.select().from(places);
    await remoteDd.insert(places).values(existedPlaces);

    const existedSectors = await db.select().from(sectors);
    await remoteDd.insert(sectors).values(existedSectors);
    
    const existedRoutes = await db.select().from(routes);
    await remoteDd.insert(routes).values(existedRoutes);
}