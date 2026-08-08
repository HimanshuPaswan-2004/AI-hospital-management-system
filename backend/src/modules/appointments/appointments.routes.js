import express from 'express';
import { getAvailableSlots, bookAppointment, getDoctorSchedule, updateAppointmentStatus, getPatientAppointments } from './appointments.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/slots', protect, getAvailableSlots);
router.get('/schedule', protect, getDoctorSchedule);
router.get('/my-appointments', protect, getPatientAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.post('/', protect, bookAppointment);

export default router;
