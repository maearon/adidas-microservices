import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = (databaseUrl: string) =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

const globalForPrisma = globalThis as unknown as {
  prismaGlobal?: PrismaClient;
};

function getPrismaUnsafe(): PrismaClient {
  const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Database URL not configured");
  }
  if (!globalForPrisma.prismaGlobal) {
    globalForPrisma.prismaGlobal = prismaClientSingleton(databaseUrl);
  }
  return globalForPrisma.prismaGlobal;
}

/**
 * Prisma is created on first use so `next build` / route collection does not require DATABASE_URL.
 */
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaUnsafe();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
});

export default prisma;
