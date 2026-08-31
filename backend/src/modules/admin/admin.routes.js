import express from 'express';
import { protect, authorize } from '../../middleware/authMiddleware.js';
import {
  getDashboardAnalytics,
  getAllUsers,
  getAllAppointments,
  getDepartments,
  createDepartment,
  getInventory,
  getPrescriptions,
  getBilling,
  getAuditLogs,
  getSettings,
  updateSettings,
  updateUserRoleStatus,
  updateAppointmentStatus,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  createInvoice,
  updateInvoiceStatus,
  createUser
} from './admin.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardAnalytics);
router.route('/users')
  .get(getAllUsers)
  .post(createUser);
router.put('/users/:id', updateUserRoleStatus);

router.route('/appointments')
  .get(getAllAppointments);
router.put('/appointments/:id', updateAppointmentStatus);

router.route('/departments')
  .get(getDepartments)
  .post(createDepartment);

router.route('/inventory')
  .get(getInventory)
  .post(addMedicine);
router.route('/inventory/:id')
  .put(updateMedicine)
  .delete(deleteMedicine);

router.get('/prescriptions', getPrescriptions);

router.route('/billing')
  .get(getBilling)
  .post(createInvoice);
router.put('/billing/:id', updateInvoiceStatus);
router.get('/audit-logs', getAuditLogs);

router.route('/settings')
  .get(getSettings)
  .put(updateSettings);

export default router;
