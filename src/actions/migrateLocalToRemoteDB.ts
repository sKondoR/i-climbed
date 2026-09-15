'use server';

import { count } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { remoteDd } from '@/lib/db/remote-db';
import { regions, places, sectors, routes } from '@/lib/db/schema';

const BATCH_SIZE = 20;
const RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;

// Error helpers

function getErrorMessage(error: unknown): string {
  return (
    (error as { cause?: { message?: string } })?.cause?.message ??
    (error as { message?: string })?.message ??
    String(error)
  );
}

function isTransientError(error: unknown): boolean {
  return /terminated|ECONNRESET|EPIPE|closed/i.test(getErrorMessage(error));
}

// Retry wrapper

async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  attempts = RETRY_ATTEMPTS,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isTransientError(error)) throw error;

      console.warn(
        `[${label}] attempt ${attempt}/${attempts} failed: ${getErrorMessage(error)}`,
      );

      if (attempt < attempts) {
        await new Promise((r) => setTimeout(r, RETRY_BASE_DELAY_MS * attempt));
      }
    }
  }

  throw lastError;
}

// Table migration

type Table =
  | typeof regions
  | typeof places
  | typeof sectors
  | typeof routes;

type MigrationResult = {
  sourceCount: number;
  targetCount: number;
};

async function migrateTable<T extends Table>(params: {
  name: string;
  table: T;
  source: typeof db;
  target: typeof remoteDd;
  batchSize?: number;
}): Promise<MigrationResult> {
  const { name, table, source, target, batchSize = BATCH_SIZE } = params;

  // Cast to any to bypass Drizzle's broken generic type check
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = table as any;

  await withRetry(() => target.delete(t), `${name}:delete`);

  const rows = await source.select().from(t);
  console.log(`[${name}] fetched ${rows.length} rows from source`);

  for (let offset = 0; offset < rows.length; offset += batchSize) {
    const batch = rows.slice(offset, offset + batchSize);
    await withRetry(
      () => target.insert(t).values(batch).onConflictDoNothing(),
      `${name}:insert@${offset}`,
    );
    console.log(
      `[${name}] inserted offset ${offset}–${offset + batch.length} / ${rows.length}`,
    );
  }

  const [row] = await withRetry(
    () => target.select({ value: count() }).from(t),
    `${name}:count`,
  );
  const targetCount = Number(row.value);

  console.log(`[${name}] done — source=${rows.length}, target=${targetCount}`);

  if (targetCount !== rows.length) {
    console.warn(
      `[${name}] count mismatch: expected ${rows.length}, got ${targetCount}`,
    );
  }

  return { sourceCount: rows.length, targetCount };
}

// Orchestrator

export async function migrateToRemote(): Promise<void> {
  // Order matters for FK constraints.
  const tables = [
    { name: 'regions', table: regions },
    { name: 'places', table: places },
    { name: 'sectors', table: sectors },
    { name: 'routes', table: routes },
  ] as const;

  for (const { name, table } of tables) {
    await migrateTable({ name, table, source: db, target: remoteDd });
  }

  console.log('Migration complete');
}