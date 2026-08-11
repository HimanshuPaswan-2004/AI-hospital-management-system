import express from 'express';
import { analyzeSymptoms, summarizeReport, chat } from './ai.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public or Protected depending on requirements.
// Usually, we want logged-in users to access these. 
// Adding protect middleware to ensure only authenticated users can use the AI
router.post('/symptom-checker', protect, analyzeSymptoms);
router.post('/summarize-report', protect, summarizeReport);
router.post('/chat', protect, chat);

export default router;
