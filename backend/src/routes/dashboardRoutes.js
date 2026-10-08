import { Router } from 'express';
import { getDashboardStats, getDashboardSummary } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all dashboard routes
router.use(authenticateToken);

router.get('/', getDashboardStats);
router.get('/summary', getDashboardSummary);

export default router;
