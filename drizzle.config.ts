import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
    ssl:  process.env.NODE_ENV === "production"
      ? undefined
      : { rejectUnauthorized: false },
  },
} satisfies Config;


// CREATE TABLE IF NOT EXISTS