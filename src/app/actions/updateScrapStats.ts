'use server';
import { db } from '@/lib/db';
import { settings, type IScrapStats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function updateScrapStats(stats: IScrapStats) {
  const result = await db.select().from(settings).limit(1).execute();
  const currentSettings = result[0];

  let newScrapStats: IScrapStats;

  if (!currentSettings) {
    newScrapStats = {
      ...stats,
      routesErrors: 0,
    };
    await db.insert(settings).values({
      scrapStats: newScrapStats,
    }).execute();
  } else {
    const previousRoutes = currentSettings.scrapStats?.routes || 0;
    const maxRoutes = Math.max(stats.routes, previousRoutes);
    
    newScrapStats = {
      ...stats,
      routes: maxRoutes,
      routesErrors: maxRoutes - stats.routes,
    };

    await db.update(settings)
      .set({ scrapStats: newScrapStats })
      .where(eq(settings.id, currentSettings.id))
      .execute();
  }
}