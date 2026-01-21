import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Function to seed admin user
async function seedAdmin() {
  try {
    console.log('Checking for admin user...');
    
    // Ensure connection is active before querying
    const { ensureConnection } = await import('./lib/prisma');
    try {
      await ensureConnection();
    } catch (error: any) {
      console.error('Failed to establish database connection:', error.message);
      throw error;
    }
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('✅ Admin korisnik već postoji');
      console.log(`   ID: ${existingAdmin.id}, Email: ${existingAdmin.email}, Role: ${existingAdmin.role}`);
      return;
    }

    console.log('Admin user not found. Creating...');

    // Hash password for admin (password: admin)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        ime: 'Admin',
        prezime: 'Korisnik',
        username: 'admin',
        email: 'admin@stroop.test',
        lozinka_hash: hashedPassword,
        dob: new Date('1990-01-01'),
        spol: 'M',
        role: 'ADMIN'
      }
    });

    console.log('✅ Admin korisnik uspješno kreiran:');
    console.log(`   ID: ${admin.id}`);
    console.log('   Username: admin');
    console.log('   Password: admin');
    console.log('   Email: admin@stroop.test');
    console.log(`   Role: ${admin.role}`);
  } catch (error: any) {
    console.error('❌ Greška pri kreiranju admin korisnika:', error);
    console.error('   Error details:', error.message);
    if (error.stack) {
      console.error('   Stack:', error.stack);
    }
    // Don't throw - allow server to continue
  }
}

// Import routes
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import leaderboardRoutes from './routes/leaderboard';
import aiRoutes from './routes/ai';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stroop Test API is running' });
});

// Admin seeding endpoint (for manual admin creation if needed)
app.post('/api/admin/seed', async (req, res) => {
  try {
    await seedAdmin();
    res.json({ message: 'Admin seeding completed. Check logs for details.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Run migrations and seed admin on startup (production only), then start server
async function startServer() {
  if (process.env.NODE_ENV === 'production' || process.env.RUN_MIGRATIONS === 'true') {
    console.log('Running Prisma migrations...');
    
    // Prepare connection string for migrations
    // Migrations need direct connection, not pooled
    // Render provides DATABASE_URL which may be a pooler URL
    // We need to convert it to direct connection for migrations
    const originalDbUrl = process.env.DATABASE_URL || '';
    let migrationDbUrl = originalDbUrl;
    
    // Convert pooler URL to direct connection URL for migrations
    if (migrationDbUrl && migrationDbUrl.includes('-pooler')) {
      // Replace pooler hostname with direct hostname
      migrationDbUrl = migrationDbUrl.replace('-pooler', '');
      console.log('Converted pooler URL to direct connection for migrations');
    }
    
    // Remove pooling parameters for migrations (they need direct connection)
    if (migrationDbUrl) {
      try {
        const url = new URL(migrationDbUrl);
        // Remove pooling parameters - migrations need direct connection
        url.searchParams.delete('pgbouncer');
        url.searchParams.delete('connection_limit');
        url.searchParams.delete('schema');
        migrationDbUrl = url.toString();
        console.log('Using direct connection for migrations (without pooling parameters)');
      } catch (error) {
        console.warn('Could not parse DATABASE_URL for migrations, using as-is:', error);
      }
    }
    
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        env: {
          ...process.env,
          DATABASE_URL: migrationDbUrl
        }
      });
      console.log('✅ Migrations completed successfully');
    } catch (error: any) {
      const errorMessage = error.message || '';
      console.error('❌ Migration failed:', errorMessage);
      
      // Check if it's a failed migration issue (P3009)
      if (errorMessage.includes('P3009') || errorMessage.includes('failed migrations')) {
        console.log('⚠️  Detected failed migration. Attempting to resolve...');
        try {
          // Mark the failed migration as rolled back so we can retry
          execSync('npx prisma migrate resolve --rolled-back 20250110000000_add_auth_and_sessions', {
            stdio: 'inherit',
            env: {
              ...process.env,
              DATABASE_URL: migrationDbUrl
            }
          });
          console.log('✅ Marked failed migration as rolled back. Retrying migrations...');
          
          // Retry migrations
          execSync('npx prisma migrate deploy', { 
            stdio: 'inherit',
            env: {
              ...process.env,
              DATABASE_URL: migrationDbUrl
            }
          });
          console.log('✅ Migrations completed successfully after resolving failed migration');
        } catch (resolveError: any) {
          console.error('❌ Could not resolve failed migration:', resolveError.message);
          console.error('   Trying alternative: using prisma db push to sync schema...');
          
          // Fallback: use db push to sync schema (for new databases)
          try {
            execSync('npx prisma db push --accept-data-loss', {
              stdio: 'inherit',
              env: {
                ...process.env,
                DATABASE_URL: migrationDbUrl
              }
            });
            console.log('✅ Schema synced using db push');
          } catch (pushError: any) {
            console.error('❌ db push also failed:', pushError.message);
            console.error('   You may need to manually fix the database state.');
          }
        }
      } else {
        console.error('   This might be normal if migrations are already applied.');
      }
      // Don't exit - allow server to start even if migrations fail
    } finally {
      // Restore original DATABASE_URL
      if (originalDbUrl) {
        process.env.DATABASE_URL = originalDbUrl;
      }
    }

    // Wait longer for Render database to be ready (free tier databases can be slow to wake up)
    console.log('Waiting for database to be ready (Render free tier may need time to wake up)...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Seed admin user after migrations
    console.log('Seeding admin user...');
    try {
      // Use ensureConnection which has retry logic built in
      const { ensureConnection } = await import('./lib/prisma');
      await ensureConnection();
      
      // Ensure Prisma client is reinitialized with correct connection
      await seedAdmin();
    } catch (error: any) {
      console.error('❌ Admin seeding failed:', error.message);
      console.error('   Server will start anyway. Admin can be created manually via /api/admin/seed endpoint.');
      console.error('   Or try logging in - admin might already exist from previous deployment.');
      // Don't exit - server can still start
    }
  }

  // Start server after migrations and seeding complete
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;