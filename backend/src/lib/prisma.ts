import { PrismaClient } from '@prisma/client';

// Create a singleton PrismaClient instance to avoid connection issues
// This is especially important on Render with connection pooling

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// For Render PostgreSQL, use direct connection
// Connection pooling can cause issues, so we'll use direct connection
let databaseUrl = process.env.DATABASE_URL || '';

// Convert pooler URL to direct connection if needed
// Render provides pooler URLs but migrations and some operations need direct connection
if (databaseUrl && databaseUrl.includes('-pooler')) {
  // Replace pooler hostname with direct hostname
  databaseUrl = databaseUrl.replace('-pooler', '');
  console.log('Converted pooler URL to direct connection');
}

// Remove any pooling parameters that might cause issues
if (databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    const params = url.searchParams;
    
    // Remove pooling parameters - use direct connection
    params.delete('pgbouncer');
    params.delete('connection_limit');
    
    // Keep schema if present, but don't add if not needed
    databaseUrl = url.toString();
    console.log('Using direct database connection (pooling disabled)');
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

// Don't test connection immediately - let it connect on first use
// This avoids connection issues during startup
// Connection will be established automatically on first query

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
