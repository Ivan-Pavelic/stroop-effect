import { PrismaClient } from '@prisma/client';

// Create a singleton PrismaClient instance to avoid connection issues
// This is especially important on Render with connection pooling

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// For Render PostgreSQL, we need to handle connection pooling properly
// Render uses PgBouncer for connection pooling
let databaseUrl = process.env.DATABASE_URL || '';

// Add connection pooling parameters for Render
// These parameters help Prisma work better with PgBouncer
if (databaseUrl && !databaseUrl.includes('?')) {
  // Add connection pool parameters
  // pgbouncer=true tells Prisma to use transaction mode (needed for pooling)
  // connection_limit limits the number of connections
  databaseUrl += '?pgbouncer=true&connection_limit=1';
  console.log('Added connection pooling parameters for Render');
} else if (databaseUrl && !databaseUrl.includes('pgbouncer')) {
  // URL already has parameters, append pgbouncer
  databaseUrl += (databaseUrl.includes('?') ? '&' : '?') + 'pgbouncer=true&connection_limit=1';
  console.log('Added pgbouncer parameter to existing connection string');
}

// Use pooler URL if explicitly provided (Render sometimes provides separate pooler URL)
if (process.env.DATABASE_POOLER_URL) {
  databaseUrl = process.env.DATABASE_POOLER_URL;
  console.log('Using explicit database pooler URL');
}

console.log('Database URL configured:', databaseUrl ? 'Set' : 'Missing');

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
