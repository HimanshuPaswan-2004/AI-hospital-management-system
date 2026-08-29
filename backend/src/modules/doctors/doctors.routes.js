import express from 'express';
import { getDoctors, getDashboardStats, getDoctorPatients } from './doctors.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getDoctors);
router.get('/dashboard', protect, getDashboardStats);
router.get('/patients', protect, getDoctorPatients);

export default router;
