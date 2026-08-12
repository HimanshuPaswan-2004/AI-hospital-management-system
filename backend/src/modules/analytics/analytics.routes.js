import express from 'express';
import { getDashboardAnalytics } from './analytics.controller.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Only ADMIN can access the analytics dashboard
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardAnalytics);

export default router;
