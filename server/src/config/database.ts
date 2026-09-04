import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';

export function createDatabase(connectionString: string, ssl?: boolean) {
  const isSsl =
    ssl ??
    (process.env.DATABASE_SSL === 'true' ||
      connectionString.includes('sslmode=require'));

  const pool = new Pool({
    connectionString,
    ssl: isSsl ? { rejectUnauthorized: false } : undefined,
  });
  return drizzle(pool, { schema });
}

export type Database = ReturnType<typeof createDatabase>;
