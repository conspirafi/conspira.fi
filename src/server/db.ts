import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configure Prisma for production (Vercel/Supabase) with connection pooling
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // Prevent "prepared statement already exists" errors in serverless environments
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown for serverless
if (process.env.NODE_ENV === "production") {
  // Set a connection pool timeout
  prisma.$connect().catch((err) => {
    console.error("Failed to connect to database:", err);
  });
}
