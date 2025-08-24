import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("❌ Database URL not found! Please set PRISMA_DATABASE_URL or DATABASE_URL environment variable.");
    console.error("Expected format: postgresql://username:password@localhost:5432/database_name");
    throw new Error("Database URL not configured");
  }
  
  console.log("✅ Database URL found:", databaseUrl.replace(/\/\/.*@/, '//***:***@'));
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    // Optimize connection pool
    // https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
    // https://www.prisma.io/docs/concepts/components/prisma-client/connection-pooling
  });
};

const globalForPrisma = globalThis as unknown as {
  prismaGlobal?: ReturnType<typeof prismaClientSingleton>;
};

let prisma: PrismaClient;

try {
  prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prismaGlobal = prisma;
  }
} catch (error) {
  console.error("❌ Failed to initialize Prisma client:", error);
  throw error;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  try {
    await prisma.$disconnect();
    console.log("✅ Prisma client disconnected");
  } catch (error) {
    console.error("❌ Error disconnecting Prisma client:", error);
  }
});

export default prisma;
