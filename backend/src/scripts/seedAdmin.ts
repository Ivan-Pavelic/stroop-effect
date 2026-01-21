import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('Admin korisnik već postoji');
      return;
    }

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

    console.log('Admin korisnik uspješno kreiran:');
    console.log('  Username: admin');
    console.log('  Password: admin');
    console.log('  Email: admin@stroop.test');
  } catch (error) {
    console.error('Greška pri kreiranju admin korisnika:', error);
    throw error;
  }
  // Don't disconnect - we're using singleton
}

seedAdmin();
