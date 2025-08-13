// import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// synchronous connection
// const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle(process.env.DRIZZLE_DATABASE_URL!, {schema});
