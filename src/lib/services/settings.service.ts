import { db } from '@/lib/db';
import { settings, type IScrapStats, type ISettings } from '@/lib/db/schema';
import { asc, desc } from 'drizzle-orm';

export class SettingsService {
  static async find(): Promise<ISettings[]> {    
    return await db
      .select()
      .from(settings)
      .orderBy(asc(settings.id));
  }

  // последнее значение
  static async findLast(): Promise<ISettings | undefined> {
    const result = await db
      .select()
      .from(settings)
      .orderBy(desc(settings.id))
      .limit(1);

    return result[0] || undefined;
  }

  static async updateScrapStats(stats: IScrapStats): Promise<void> {    
    const lastResult = await this.findLast();
    const currentMaxRoutes = lastResult?.scrapStats?.routes || 0;
    const newSuccessfulRoutes = stats.routes;
    const maxRoutes = Math.max(currentMaxRoutes, newSuccessfulRoutes);
    const routesErrors = maxRoutes - newSuccessfulRoutes;

    const newScrapStats: IScrapStats = {
      ...stats,
      routes: maxRoutes,
      routesErrors,
    };
    await db.insert(settings).values({
      scrapStats: newScrapStats,
    }).execute();
  }
}
