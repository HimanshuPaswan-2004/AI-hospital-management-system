import express from 'express';
import { getDoctors } from './doctors.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Allow authenticated users to view the doctor directory
router.get('/', protect, getDoctors);

export default router;
