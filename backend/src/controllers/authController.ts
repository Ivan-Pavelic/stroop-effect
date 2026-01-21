import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { RegisterRequest, AuthRequest } from '../types';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ime, prezime, email, password, dob, spol }: RegisterRequest = req.body;

    // Check if user already exists by email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      res.status(400).json({ error: 'Korisnik s ovom email adresom već postoji' });
      return;
    }

    // Generate username from ime.prezime (lowercase, no spaces)
    const baseUsername = `${ime.toLowerCase()}.${prezime.toLowerCase()}`.replace(/\s+/g, '');
    let username = baseUsername;
    let counter = 1;

    // Ensure username is unique
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const lozinka_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        ime,
        prezime,
        username,
        email,
        lozinka_hash,
        dob: new Date(dob),
        spol,
        role: 'USER'
      }
    });

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, username: user.username },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Korisnik uspješno registriran',
      token,
      user: {
        id: user.id,
        ime: user.ime,
        prezime: user.prezime,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Neuspješna registracija korisnika' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password }: AuthRequest = req.body;

    if (!password) {
      res.status(400).json({ error: 'Lozinka je obavezna' });
      return;
    }

    // Find user by username or email
    let user = null;
    if (username) {
      user = await prisma.user.findUnique({
        where: { username }
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } else {
      res.status(400).json({ error: 'Korisničko ime ili email je obavezan' });
      return;
    }

    if (!user) {
      res.status(401).json({ error: 'Nevažeće korisničko ime ili lozinka' });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.lozinka_hash);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Nevažeće korisničko ime ili lozinka' });
      return;
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, username: user.username },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Prijava uspješna',
      token,
      user: {
        id: user.id,
        ime: user.ime,
        prezime: user.prezime,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Neuspješna prijava' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Niste autentificirani' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        ime: true,
        prezime: true,
        username: true,
        email: true,
        dob: true,
        spol: true,
        role: true,
        created_at: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'Korisnik nije pronađen' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Neuspješno dohvaćanje profila' });
  }
};