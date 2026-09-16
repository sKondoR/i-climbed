'use server'

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolClient } from 'pg';
import * as schema from './schema';

const connectionString = process.env.REMOTE_POSTGRES_URL;

console.log('connectionString', process.env.REMOTE_POSTGRES_URL);
if (!connectionString) {
  throw new Error('REMOTE_POSTGRES_URL is required');
}
const poolRemote = new Pool({
  connectionString,
  max: 3,                         // was 5 — headroom under the server cap
  min: 1,                         // keep one warm socket
  idleTimeoutMillis: 30_000,      // was 5_000 — stop reaping mid-loop
  connectionTimeoutMillis: 30_000,// was 10_000 — allow cold-start wake
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
  allowExitOnIdle: true,

});

poolRemote.on('error', (err) => console.error('poolRemote error:', err));
poolRemote.on('remove', () => console.log(`poolRemote remove @ ${Date.now()}`));
poolRemote.on('connect', () => console.log(`poolRemote connect @ ${Date.now()}`));

async function testConnection() {
  let client: PoolClient | undefined;

  try {
    client = await poolRemote.connect();
    console.log('✅ Remote Database connected successfully');
  } catch (error) {
    console.error('❌ Remote Database connection failed:', error);
    throw error;
  } finally {
    // Return the client to the pool, otherwise every call leaks a connection until the pool is exhausted
    client?.release();
  }
}

testConnection().catch(console.error);

export const remoteDd = drizzle(poolRemote, { schema });

// For server actions
export async function getDb() {
  return remoteDd;
}