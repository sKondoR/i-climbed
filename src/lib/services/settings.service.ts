import { db } from '@/lib/db';
import { settings, type IScrapStats, type ISettings } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export class SettingsService {
  static async find(): Promise<ISettings[]> {    
    return await db
      .select()
      .from(settings)
      .orderBy(asc(settings.id));
  }

  static async updateScrapStats(stats: IScrapStats): Promise<undefined> {    
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

      return;
    }
  }
}
