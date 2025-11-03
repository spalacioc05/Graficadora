import 'dotenv/config';
import { Pool } from 'pg';

export const PG_POOL = 'PG_POOL';

export const PgPoolProvider = {
  provide: PG_POOL,
  useFactory: async () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL env var is required');
    }
    const pool = new Pool({ connectionString, max: 10, ssl: { rejectUnauthorized: false } });
    // Do not connect immediately; connections will be established on first query
    return pool;
  },
};

export const closePool = async (pool) => {
  try {
    await pool.end();
  } catch (e) {
    // ignore
  }
};
