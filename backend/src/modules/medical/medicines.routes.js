import express from 'express';
import { getMedicines, addMedicine, updateMedicine } from './medicines.controller.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('ADMIN'), getMedicines)
  .post(protect, authorize('ADMIN'), addMedicine);

router.route('/:id')
  .put(protect, authorize('ADMIN'), updateMedicine);

export default router;
