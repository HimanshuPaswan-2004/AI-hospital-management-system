import express from 'express';
import { getContacts, getMessages, sendMessage } from './messages.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/contacts', protect, getContacts);
router.post('/', protect, sendMessage);
router.get('/:userId', protect, getMessages);

export default router;
