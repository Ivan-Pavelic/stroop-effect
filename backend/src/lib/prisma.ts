import { PrismaClient } from '@prisma/client';

// Create a singleton PrismaClient instance to avoid connection issues
// This is especially important on Render with connection pooling

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// For Render PostgreSQL, use connection pooling URL if available
// Connection pooler URLs typically have '-pooler' in the hostname
// or you can append ?pgbouncer=true for connection pooling
let databaseUrl = process.env.DATABASE_URL || '';

// If not already using a pooler URL, check if we should use one
// Render provides both direct and pooler URLs
// The pooler URL is better for serverless/autoscaling scenarios
if (databaseUrl && !databaseUrl.includes('pooler') && process.env.DATABASE_POOLER_URL) {
  databaseUrl = process.env.DATABASE_POOLER_URL;
  console.log('Using database pooler URL for better connection management');
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
