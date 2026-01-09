import { drizzle } from 'drizzle-orm/vercel-postgres';
import { VercelPool } from '@vercel/postgres';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL;

console.log('connectionString', process.env.POSTGRES_URL);
if (!connectionString) {
  throw new Error('POSTGRES_URL is required');
}
const pool = new VercelPool({ connectionString });

async function testConnection() {
  try {
    await pool.connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

testConnection().catch(console.error);

export const db = drizzle(pool, { schema });

// // Helper function for transactions
// export async function withTransaction<T>(
//   callback: (tx: typeof db) => Promise<T>
// ): Promise<T> {
//   return await db.transaction(callback);
// }

// For server actions
export async function getDb() {
  return db;
}