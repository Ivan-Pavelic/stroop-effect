import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // Get top players based on their best cognitive score
    const topResults = await prisma.result.findMany({
      include: {
        game: {
          include: {
            user: {
              select: {
                id: true,
                ime: true,
                prezime: true
              }
            }
          }
        }
      },
      orderBy: {
        kognitivni_score: 'desc'
      },
      take: limit * 2 // Get more to filter unique users
    });

    // Filter to get only the best score per user
    const userBestScores = new Map();
    
    for (const result of topResults) {
      const userId = result.game.user.id;
      if (!userBestScores.has(userId) || result.kognitivni_score > userBestScores.get(userId).score) {
        userBestScores.set(userId, {
          userId,
          name: `${result.game.user.ime} ${result.game.user.prezime.charAt(0)}.`,
          score: result.kognitivni_score,
          accuracy: result.tocnost,
          avgTime: result.brzina
        });
      }
    }

    // Convert to array and sort
    const leaderboard = Array.from(userBestScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry
      }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};

export const getUserRank = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Get user's best score
    const userBestResult = await prisma.result.findFirst({
      where: {
        game: {
          user_id: userId
        }
      },
      orderBy: {
        kognitivni_score: 'desc'
      }
    });

    if (!userBestResult) {
      res.json({ rank: null, message: 'No games played yet' });
      return;
    }

    // Count how many users have a better best score
    const betterScores = await prisma.result.groupBy({
      by: ['game_id'],
      _max: {
        kognitivni_score: true
      },
      having: {
        kognitivni_score: {
          _max: {
            gt: userBestResult.kognitivni_score
          }
        }
      }
    });

    const rank = betterScores.length + 1;

    res.json({
      rank,
      bestScore: userBestResult.kognitivni_score,
      accuracy: userBestResult.tocnost,
      speed: userBestResult.brzina
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({ error: 'Failed to get user rank' });
  }
};