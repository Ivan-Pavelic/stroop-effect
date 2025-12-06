import { Router } from 'express';
import { analyzePerformance, generateTasks, getInsights } from '../controllers/aiController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

// POST /api/ai/analyze (public - for guest play too)
router.post('/analyze', optionalAuth, analyzePerformance);

// POST /api/ai/generate-tasks (public - for guest play)
router.post('/generate-tasks', optionalAuth, generateTasks);

// POST /api/ai/insights (protected - requires login)
router.post('/insights', authenticateToken, getInsights);

export default router;