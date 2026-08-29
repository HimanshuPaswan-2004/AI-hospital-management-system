import express from 'express';
import { analyzeSymptoms, summarizeReport, explainPrescription, recommendDoctor, findAppointmentSlots, chat } from './ai.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Adding protect middleware to ensure only authenticated users can use the AI
router.post('/symptom-checker', protect, analyzeSymptoms);
router.post('/summarize-report', protect, summarizeReport);
router.post('/explain-prescription', protect, explainPrescription);
router.post('/recommend-doctor', protect, recommendDoctor);
router.post('/find-appointment-slots', protect, findAppointmentSlots);
router.post('/chat', protect, chat);

export default router;
