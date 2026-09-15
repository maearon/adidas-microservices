import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export type AppDatabase = NeonHttpDatabase<typeof schema>;

let _db: AppDatabase | null = null;
let _pool: Pool | null = null;

function isNeonUrl(url: string) {
  return url.includes("neon.tech");
}

export function getDb(): AppDatabase {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!_db) {
    if (isNeonUrl(databaseUrl)) {
      _db = drizzleNeon(databaseUrl, { schema });
    } else {
      _pool = new Pool({ connectionString: databaseUrl });
      _db = drizzlePg(_pool, { schema }) as unknown as AppDatabase;
    }
  }
  return _db;
}

/**
 * Lazy Drizzle client so importing API routes does not connect or throw during `next build`
 * when env vars are absent. First property access delegates to {@link getDb}.
 */
export const db = new Proxy({} as AppDatabase, {
  get(_target, prop, receiver) {
    const real = getDb() as object;
    const value = Reflect.get(real, prop, receiver);
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(real);
    }
    return value;
  },
});
