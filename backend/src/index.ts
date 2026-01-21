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
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migrations completed successfully');
    } catch (error: any) {
      console.error('❌ Migration failed:', error.message);
      // Don't exit - allow server to start even if migrations fail
      // This allows you to fix migration issues without breaking the deployment
    }

    // Seed admin user after migrations
    console.log('Seeding admin user...');
    await seedAdmin();
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