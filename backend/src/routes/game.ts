import { Router } from 'express';
import { saveGameResult, getUserGames, getGameStats } from '../controllers/gameController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /api/game/result (protected)
router.post('/result', authenticateToken, saveGameResult);

// GET /api/game/history (protected)
router.get('/history', authenticateToken, getUserGames);

// GET /api/game/stats (protected)
router.get('/stats', authenticateToken, getGameStats);

export default router;