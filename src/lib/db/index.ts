'use server'

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolClient } from 'pg';

import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is required');
}
const pool =  new Pool({
  connectionString,
  max: 30,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
});

async function testConnection() {
  let client: PoolClient | undefined;

  try {
    client = await pool.connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  } finally {
    // Return the client to the pool, otherwise every call leaks a connection until the pool is exhausted
    client?.release();
  }
}

testConnection().catch(console.error);

export const db = drizzle(pool, { schema });

// For server actions
export async function getDb() {
  return db;
}