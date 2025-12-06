import { Router } from 'express';
import { getLeaderboard, getUserRank } from '../controllers/leaderboardController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/leaderboard (public)
router.get('/', getLeaderboard);

// GET /api/leaderboard/my-rank (protected)
router.get('/my-rank', authenticateToken, getUserRank);

export default router;