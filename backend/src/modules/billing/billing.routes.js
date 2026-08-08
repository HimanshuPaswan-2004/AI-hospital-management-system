import express from 'express';
import { generateInvoice, getInvoices, markInvoiceAsPaid } from './billing.controller.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('ADMIN'), getInvoices);

router.route('/generate/:appointmentId')
  .post(protect, authorize('ADMIN'), generateInvoice);

router.route('/:id/pay')
  .put(protect, authorize('ADMIN'), markInvoiceAsPaid);

export default router;
