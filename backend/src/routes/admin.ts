import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  getAllUsers,
  createUser,
  deleteUser,
  getUserStats,
  getUserAIFeedback
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/users
router.get('/users', getAllUsers);

// POST /api/admin/users
router.post('/users', createUser);

// DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

// GET /api/admin/users/:id/stats
router.get('/users/:id/stats', getUserStats);

// GET /api/admin/users/:id/ai-feedback
router.get('/users/:id/ai-feedback', getUserAIFeedback);

export default router;
