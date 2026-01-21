import { PrismaClient } from '@prisma/client';

// Create a singleton PrismaClient instance to avoid connection issues
// This is especially important on Render with connection pooling

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// For Render PostgreSQL, we need to handle connection pooling properly
// Render uses PgBouncer for connection pooling
let databaseUrl = process.env.DATABASE_URL || '';

// Use pooler URL if explicitly provided (Render sometimes provides separate pooler URL)
if (process.env.DATABASE_POOLER_URL) {
  databaseUrl = process.env.DATABASE_POOLER_URL;
  console.log('Using explicit database pooler URL');
} else if (databaseUrl) {
  // Parse URL to check if it already has query parameters
  try {
    const url = new URL(databaseUrl);
    const params = url.searchParams;
    
    // Add Prisma-specific parameters for connection pooling
    // These are needed for PgBouncer transaction mode
    if (!params.has('pgbouncer')) {
      params.set('pgbouncer', 'true');
    }
    if (!params.has('connection_limit')) {
      params.set('connection_limit', '1');
    }
    // Add schema parameter for Prisma migrations (if not present)
    if (!params.has('schema') && !params.has('schema')) {
      params.set('schema', 'public');
    }
    
    databaseUrl = url.toString();
    console.log('Configured DATABASE_URL with connection pooling parameters');
  } catch (error) {
    console.warn('Could not parse DATABASE_URL, using as-is:', error);
  }
}

if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set!');
} else {
  // Log connection info (but hide password)
  const urlForLog = databaseUrl.replace(/:[^:@]+@/, ':****@');
  console.log('Database connection configured:', urlForLog);
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

// Test connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma connected to database');
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error.message);
  });

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
