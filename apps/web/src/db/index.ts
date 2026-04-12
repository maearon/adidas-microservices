import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

export type AppDatabase = NeonHttpDatabase<typeof schema>;

let _db: AppDatabase | null = null;

export function getDb(): AppDatabase {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!_db) {
    _db = drizzle(databaseUrl, { schema });
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
