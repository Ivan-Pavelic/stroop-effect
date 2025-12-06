import { Request, Response } from 'express';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

export const analyzePerformance = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameData = req.body;

    const response = await fetch(`${AI_SERVICE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });

    const data = await response.json() as { success: boolean; error?: string; analysis?: unknown };

    if (data.success) {
      res.json(data);
    } else {
      res.status(500).json({ error: data.error || 'AI analysis failed' });
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: 'Failed to connect to AI service' });
  }
};

export const generateTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskConfig = req.body;

    const response = await fetch(`${AI_SERVICE_URL}/api/generate-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskConfig),
    });

    const data = await response.json() as { success: boolean; error?: string; tasks?: unknown };

    if (data.success) {
      res.json(data);
    } else {
      res.status(500).json({ error: data.error || 'Task generation failed' });
    }
  } catch (error) {
    console.error('Task generation error:', error);
    res.status(500).json({ error: 'Failed to connect to AI service' });
  }
};

export const getInsights = async (req: Request, res: Response): Promise<void> => {
  try {
    const historyData = req.body;

    const response = await fetch(`${AI_SERVICE_URL}/api/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(historyData),
    });

    const data = await response.json() as { success: boolean; error?: string; insights?: unknown };

    if (data.success) {
      res.json(data);
    } else {
      res.status(500).json({ error: data.error || 'Insights generation failed' });
    }
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to connect to AI service' });
  }
};