import express from 'express';
import { registerUser, loginUser, getMe, resetPasswordDirect } from './auth.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.post('/reset-password-direct', resetPasswordDirect);

export default router;
