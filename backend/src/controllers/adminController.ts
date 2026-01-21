import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

// GET /admin/users - List all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        ime: true,
        prezime: true,
        username: true,
        email: true,
        dob: true,
        spol: true,
        role: true,
        created_at: true,
        _count: {
          select: {
            games: true,
            gameSessions: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Neuspješno dohvaćanje korisnika' });
  }
};

// POST /admin/users - Create new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ime, prezime, email, password, dob, spol, role } = req.body;

    if (!ime || !prezime || !email || !password) {
      res.status(400).json({ error: 'Ime, prezime, email i lozinka su obavezni' });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: `${ime.toLowerCase()}.${prezime.toLowerCase()}` }
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Korisnik s ovom email adresom ili korisničkim imenom već postoji' });
      return;
    }

    // Generate username
    const baseUsername = `${ime.toLowerCase()}.${prezime.toLowerCase()}`.replace(/\s+/g, '');
    let username = baseUsername;
    let counter = 1;

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
        spol: spol || 'M',
        role: role || 'USER'
      },
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

    res.status(201).json({
      message: 'Korisnik uspješno kreiran',
      user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Neuspješno kreiranje korisnika' });
  }
};

// DELETE /admin/users/:id - Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Nevažeći ID korisnika' });
      return;
    }

    // Prevent deleting yourself
    if (userId === req.user?.userId) {
      res.status(400).json({ error: 'Ne možete obrisati vlastiti račun' });
      return;
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Korisnik uspješno obrisan' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Neuspješno brisanje korisnika' });
  }
};

// GET /admin/users/:id/stats - Get user statistics for chart
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Nevažeći ID korisnika' });
      return;
    }

    const games = await prisma.game.findMany({
      where: { user_id: userId },
      include: {
        result: true,
        sessions: {
          select: {
            is_congruent: true,
            is_correct: true,
            reaction_time: true
          }
        }
      },
      orderBy: {
        datum: 'asc'
      }
    });

    // Format data for chart (timeseries)
    // Remove duplicates by game ID (in case same game was saved twice)
    const uniqueGames = new Map<number, typeof games[0]>();
    games.forEach(game => {
      // Keep only unique games by ID (if duplicate, keep the first one)
      if (!uniqueGames.has(game.id)) {
        uniqueGames.set(game.id, game);
      }
    });

    const chartData = Array.from(uniqueGames.values())
      .sort((a, b) => a.datum.getTime() - b.datum.getTime())
      .map((game, index) => ({
        date: game.datum.toISOString().split('T')[0],
        dateTime: game.datum.getTime(), // For sorting
        gameNumber: index + 1, // Sequential game number
        accuracy: game.result?.tocnost || 0,
        cognitiveScore: game.result?.kognitivni_score || 0,
        avgTime: game.prosjecno_vrijeme_odgovora,
        totalTrials: game.broj_zadataka,
        correctTrials: game.broj_zadataka - game.broj_pogresaka,
        congruentAccuracy: game.tocnost_kongruentnih,
        incongruentAccuracy: game.tocnost_nekongruentnih
      }));

    // Calculate summary stats
    const totalGames = games.length;
    const avgAccuracy = games.length > 0
      ? games.reduce((sum, g) => sum + (g.result?.tocnost || 0), 0) / games.length
      : 0;
    const avgCognitiveScore = games.length > 0
      ? games.reduce((sum, g) => sum + (g.result?.kognitivni_score || 0), 0) / games.length
      : 0;

    res.json({
      userId,
      totalGames,
      avgAccuracy: Math.round(avgAccuracy * 100) / 100,
      avgCognitiveScore: Math.round(avgCognitiveScore * 100) / 100,
      chartData
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Neuspješno dohvaćanje statistika' });
  }
};

// GET /admin/users/:id/ai-feedback - Get AI feedback for user
export const getUserAIFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Nevažeći ID korisnika' });
      return;
    }

    // Get user's latest game
    const latestGame = await prisma.game.findFirst({
      where: { user_id: userId },
      include: {
        result: true,
        sessions: true,
        user: {
          select: {
            dob: true,
            spol: true
          }
        }
      },
      orderBy: {
        datum: 'desc'
      }
    });

    if (!latestGame || !latestGame.result) {
      res.json({
        hasData: false,
        message: 'Korisnik još nije odigrao igru'
      });
      return;
    }

    // Calculate age from dob
    const age = Math.floor((Date.now() - latestGame.user.dob.getTime()) / (1000 * 60 * 60 * 24 * 365));

    // Prepare data for AI service
    const correctTimes = latestGame.sessions
      .filter(s => s.is_correct)
      .map(s => s.reaction_time);

    const avgTime = correctTimes.length > 0
      ? correctTimes.reduce((a, b) => a + b, 0) / correctTimes.length
      : 0;

    const accuracy = latestGame.result.tocnost;

    // Call Python AI service
    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';
    
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          corr_mean: accuracy / 100, // Convert to 0-1 range
          rt_mean: avgTime,
          age: age,
          sex: latestGame.user.spol === 'M' ? 1 : 0,
          timeofday: new Date().getHours() * 60 + new Date().getMinutes(),
          roundTimes: latestGame.sessions.map(s => s.reaction_time),
          answers: latestGame.sessions.map(s => s.is_correct ? 1 : 0),
          totalRounds: latestGame.sessions.length
        }),
      });

      const aiData = await response.json() as { success: boolean; error?: string; analysis?: any };

      if (aiData.success && aiData.analysis) {
        // Extract y value from AI analysis (Python service now returns it explicitly)
        const y = aiData.analysis.y ?? (aiData.analysis.cognitiveScore === 53.5 ? 1 : 0);

        res.json({
          hasData: true,
          gameDate: latestGame.datum.toISOString(),
          aiAnalysis: aiData.analysis,
          yValue: y,
          feedback: generateFeedbackMessage(y, accuracy, avgTime)
        });
      } else {
        res.status(500).json({ error: aiData.error || 'AI analiza nije uspjela' });
      }
    } catch (error) {
      console.error('AI service error:', error);
      res.status(500).json({ error: 'Neuspješna veza s AI servisom' });
    }
  } catch (error) {
    console.error('Get AI feedback error:', error);
    res.status(500).json({ error: 'Neuspješno dohvaćanje AI povratne informacije' });
  }
};

// Helper function to generate feedback message (will be updated in D3)
function generateFeedbackMessage(y: number, accuracy: number, avgTime: number): string {
  if (y === 1) {
    if (accuracy < 60) {
      return 'Preporučujemo konzultaciju s liječnikom zbog značajnih promjena u kognitivnim performansama.';
    }
    return 'Uočene su promjene u kognitivnim performansama. Preporučujemo praćenje i ponovno testiranje kasnije.';
  } else {
    if (accuracy >= 85) {
      return 'Vaše kognitivne performanse su odlične. Nastavite s redovitim vježbanjem.';
    }
    return 'Vaše kognitivne performanse su unutar normalnog raspona. Ako imate zabrinutosti, razmotrite profesionalni savjet.';
  }
}
