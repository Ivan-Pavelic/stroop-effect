import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GameResult } from '../types';

const prisma = new PrismaClient();

export const saveGameResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const gameData: GameResult = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Niste autentificirani' });
      return;
    }

    // avgTime should already be calculated from correct answers only (from frontend)
    // But verify: if trials are provided, recalculate from correct trials
    let avgTime = gameData.avgTime;
    let congruentAccuracy = gameData.congruentAccuracy || 0;
    let incongruentAccuracy = gameData.incongruentAccuracy || 0;
    let numCongruent = 0;
    let numIncongruent = 0;
    let correctCongruent = 0;
    let correctIncongruent = 0;

    if (gameData.trials && gameData.trials.length > 0) {
      // Recalculate from trial data
      const correctTrials = gameData.trials.filter(t => t.isCorrect);
      avgTime = correctTrials.length > 0
        ? correctTrials.reduce((sum, t) => sum + t.reactionTime, 0) / correctTrials.length
        : 0;

      // Calculate congruent/incongruent stats
      gameData.trials.forEach(trial => {
        if (trial.isCongruent) {
          numCongruent++;
          if (trial.isCorrect) correctCongruent++;
        } else {
          numIncongruent++;
          if (trial.isCorrect) correctIncongruent++;
        }
      });

      congruentAccuracy = numCongruent > 0 ? (correctCongruent / numCongruent) * 100 : 0;
      incongruentAccuracy = numIncongruent > 0 ? (correctIncongruent / numIncongruent) * 100 : 0;
    }

    // Calculate total duration (sum of all reaction times)
    const totalDuration = gameData.roundTimes.length > 0
      ? gameData.roundTimes.reduce((a, b) => a + b, 0)
      : 0;

    // Create game record
    const game = await prisma.game.create({
      data: {
        user_id: userId,
        datum: new Date(),
        trajanje: totalDuration,
        broj_zadataka: gameData.totalRounds,
        broj_pogresaka: gameData.totalRounds - gameData.score,
        prosjecno_vrijeme_odgovora: avgTime,
        broj_kongruentnih: numCongruent,
        broj_nekongruentnih: numIncongruent,
        tocnost_kongruentnih: congruentAccuracy,
        tocnost_nekongruentnih: incongruentAccuracy
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

    // Create game session records (trial-level data)
    if (gameData.trials && gameData.trials.length > 0) {
      await prisma.gameSession.createMany({
        data: gameData.trials.map((trial, index) => ({
          game_id: game.id,
          user_id: userId,
          trial_number: index + 1,
          is_congruent: trial.isCongruent,
          word_text: trial.wordText,
          display_color: trial.displayColor,
          correct_answer: trial.correctAnswer,
          user_answer: trial.userAnswer,
          is_correct: trial.isCorrect,
          reaction_time: trial.reactionTime
        }))
      });
    }

    res.status(201).json({
      message: 'Rezultat igre uspješno spremljen',
      game,
      result
    });
  } catch (error) {
    console.error('Save game result error:', error);
    res.status(500).json({ error: 'Neuspješno spremanje rezultata igre' });
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