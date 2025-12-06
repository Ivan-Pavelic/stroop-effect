import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GameResult } from '../types';

const prisma = new PrismaClient();

export const saveGameResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const gameData: GameResult = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Calculate average time
    const avgTime = gameData.roundTimes.length > 0
      ? gameData.roundTimes.reduce((a, b) => a + b, 0) / gameData.roundTimes.length
      : 0;

    // Calculate total duration
    const totalDuration = gameData.roundTimes.reduce((a, b) => a + b, 0);

    // Create game record
    const game = await prisma.game.create({
      data: {
        user_id: userId,
        datum: new Date(),
        trajanje: totalDuration,
        broj_zadataka: gameData.totalRounds,
        broj_pogresaka: gameData.totalRounds - gameData.score,
        prosjecno_vrijeme_odgovora: avgTime
      }
    });

    // Create result record
    const result = await prisma.result.create({
      data: {
        game_id: game.id,
        tocnost: gameData.accuracy,
        brzina: avgTime,
        kognitivni_score: calculateCognitiveScore(gameData)
      }
    });

    res.status(201).json({
      message: 'Game result saved successfully',
      game,
      result
    });
  } catch (error) {
    console.error('Save game result error:', error);
    res.status(500).json({ error: 'Failed to save game result' });
  }
};

export const getUserGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const games = await prisma.game.findMany({
      where: { user_id: userId },
      include: {
        result: true
      },
      orderBy: { datum: 'desc' },
      take: 20
    });

    res.json({ games });
  } catch (error) {
    console.error('Get user games error:', error);
    res.status(500).json({ error: 'Failed to get games' });
  }
};

export const getGameStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const games = await prisma.game.findMany({
      where: { user_id: userId },
      include: { result: true }
    });

    if (games.length === 0) {
      res.json({
        totalGames: 0,
        avgAccuracy: 0,
        avgSpeed: 0,
        bestScore: 0,
        avgCognitiveScore: 0
      });
      return;
    }

    const results = games.map(g => g.result).filter(r => r !== null);
    
    const stats = {
      totalGames: games.length,
      avgAccuracy: results.reduce((a, r) => a + (r?.tocnost || 0), 0) / results.length,
      avgSpeed: results.reduce((a, r) => a + (r?.brzina || 0), 0) / results.length,
      bestScore: Math.max(...results.map(r => r?.kognitivni_score || 0)),
      avgCognitiveScore: results.reduce((a, r) => a + (r?.kognitivni_score || 0), 0) / results.length
    };

    res.json(stats);
  } catch (error) {
    console.error('Get game stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

// Helper function to calculate cognitive score
function calculateCognitiveScore(gameData: GameResult): number {
  const accuracyWeight = 0.6;
  const speedWeight = 0.4;
  
  // Accuracy score (0-100)
  const accuracyScore = gameData.accuracy;
  
  // Speed score (faster = better, normalize to 0-100)
  // Assuming 500ms is excellent (100) and 3000ms is poor (0)
  const avgTime = gameData.avgTime;
  const speedScore = Math.max(0, Math.min(100, ((3000 - avgTime) / 2500) * 100));
  
  // Combined score
  const cognitiveScore = Math.round(
    (accuracyScore * accuracyWeight) + (speedScore * speedWeight)
  );
  
  return cognitiveScore;
}