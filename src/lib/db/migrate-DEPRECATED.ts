import { db } from '@/lib/db/index';
import { remoteDd } from '@/lib/db/remote-db';
import { regions, places, sectors, routes } from '@/lib/db/schema';

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      lastErr = e;
      const msg = e?.cause?.message ?? e?.message ?? '';
      const transient = /terminated|ECONNRESET|EPIPE|closed/i.test(msg);
      if (!transient) throw e;
      console.warn(`Retry ${i + 1}/${attempts} after: ${msg}`);
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastErr;
}

export async function migrateToRemote() {
    // await remoteDd.delete(regions);
    // const existedData = await db.select().from(regions);
    // console.log('local>', existedData.length);
    // await remoteDd.insert(regions).values(existedData);
    console.log('region migration done');

    // await withRetry(() => remoteDd.delete(places));
    // const existedData = await db.select().from(places);

    // try {
    //     const batchSize = 20;

    //     for (let i = 0; i < existedData.length; i += batchSize) {
    //         const batch = existedData.slice(i, i + batchSize);
    //         try {
    //             await withRetry(() => remoteDd.insert(places).values(batch).onConflictDoNothing());
    //             console.log('finish insert> ', i);
    //         } catch (e) {
    //             console.error(`FAILED at offset ${i}`, e);
    //             throw e;
    //         }
    //     }
    // } catch (err) {
    //     console.error(err);
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     console.error('DB cause:', (err as any).cause);
    // }
    // console.log('get remote places> ');
    // await withRetry(async () =>  {
    //     const existedData2 = await remoteDd.select().from(places);
    //     console.log('remote places: ', existedData2.length)
    // })

    console.log('places migration done');

    // await withRetry(() => remoteDd.delete(sectors));
    // const existedSectors = await db.select().from(sectors);

    // try {
    //     const batchSize = 20;

    //     for (let i = 0; i < existedSectors.length; i += batchSize) {
    //         const batch = existedSectors.slice(i, i + batchSize);
    //         try {
    //             await withRetry(() => remoteDd.insert(sectors).values(batch).onConflictDoNothing());
    //             console.log('finish insert> ', i);
    //         } catch (e) {
    //             console.error(`FAILED at offset ${i}`, e);
    //             throw e;
    //         }
    //     }
    // } catch (err) {
    //     console.error(err);
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     console.error('DB cause:', (err as any).cause);
    // }
    // console.log('get remote sectors> ');
    // await withRetry(async () =>  {
    //     const existedSectors2 = await remoteDd.select().from(sectors);
    //     console.log('remote places: ', existedSectors2.length)
    // })

    console.log('sectors migration done');

    await withRetry(() => remoteDd.delete(routes));
    const existedRoutes = await db.select().from(routes);
    console.log('existedRoutes.length> ', existedRoutes.length)

    try {
        const batchSize = 10;

        for (let i = 0; i < existedRoutes.length; i += batchSize) {
            const batch = existedRoutes.slice(i, i + batchSize);
            try {
                await withRetry(() => remoteDd.insert(routes).values(batch).onConflictDoNothing());
                console.log('finish insert> ', i);
            } catch (e) {
                console.error(`FAILED at offset ${i}`, e);
                throw e;
            }
        }
    } catch (err) {
        console.error(err);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error('DB cause:', (err as any).cause);
    }
    console.log('get remote routes> ');
    // await withRetry(async () =>  {
    //     const existedRoutes2 = await remoteDd.select().from(routes);
    //     console.log('remote places: ', existedRoutes2.length)
    // })

    console.log('routes migration done');
}