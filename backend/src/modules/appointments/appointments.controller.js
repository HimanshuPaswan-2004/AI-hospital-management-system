import prisma from '../../config/db.js';
import { startOfDay, endOfDay } from 'date-fns';

// Standard 30-minute slots between 9 AM and 5 PM
const STANDARD_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM"
];

// @desc    Get available slots for a doctor on a specific date
// @route   GET /api/appointments/slots
// @access  Private
export const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      res.status(400);
      throw new Error('Doctor ID and Date are required');
    }

    const queryDate = new Date(date);
    
    // Find all booked appointments for this doctor on this day
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: startOfDay(queryDate),
          lte: endOfDay(queryDate),
        },
        status: {
          not: 'CANCELLED' // Cancelled slots become available again
        }
      },
      select: {
        timeSlot: true
      }
    });

    const bookedSlots = bookedAppointments.map(app => app.timeSlot);
    const availableSlots = STANDARD_SLOTS.filter(slot => !bookedSlots.includes(slot));

    res.json({ availableSlots });
  } catch (error) {
    next(error);
  }
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patients only)
export const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, timeSlot, reason } = req.body;
    
    if (req.user.role !== 'PATIENT') {
      res.status(403);
      throw new Error('Only patients can book appointments');
    }

    const normalizedDate = startOfDay(new Date(appointmentDate));

    // Check if slot is already booked (Database unique constraint handles this, but it's good to check first for friendly error)
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: normalizedDate,
        timeSlot,
        status: { not: 'CANCELLED' }
      }
    });

    if (existingAppointment) {
      res.status(400);
      throw new Error('This time slot is already booked. Please choose another slot.');
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: req.user.id,
        doctorId,
        appointmentDate: normalizedDate,
        timeSlot,
        reason
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    // Catch Prisma unique constraint violation
    if (error.code === 'P2002') {
      res.status(400);
      next(new Error('This time slot is already booked. Please choose another slot.'));
    } else {
      next(error);
    }
  }
};

// @desc    Get doctor's schedule
// @route   GET /api/appointments/schedule
// @access  Private (Doctors only)
export const getDoctorSchedule = async (req, res, next) => {
  try {
    if (req.user.role !== 'DOCTOR') {
      res.status(403);
      throw new Error('Only doctors can view their schedule');
    }

    const { date } = req.query;
    let dateFilter = { gte: startOfDay(new Date()) }; // Default: today and future

    if (date) {
      const queryDate = new Date(date);
      dateFilter = {
        gte: startOfDay(queryDate),
        lte: endOfDay(queryDate),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: req.user.id,
        appointmentDate: dateFilter,
        status: { not: 'CANCELLED' } // Usually don't show cancelled on schedule
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            patientProfile: true
          }
        }
      },
      orderBy: [
        { appointmentDate: 'asc' },
        { timeSlot: 'asc' }
      ]
    });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctors only)
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'DOCTOR') {
      res.status(403);
      throw new Error('Only doctors can update appointment status');
    }

    if (!['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    // Verify the appointment belongs to this doctor
    const existing = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!existing || existing.doctorId !== req.user.id) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status }
    });

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient's appointments
// @route   GET /api/appointments/my-appointments
// @access  Private (Patients only)
export const getPatientAppointments = async (req, res, next) => {
  try {
    if (req.user.role !== 'PATIENT') {
      res.status(403);
      throw new Error('Only patients can view their appointments');
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: req.user.id
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            doctorProfile: {
              select: {
                specialization: true
              }
            }
          }
        }
      },
      orderBy: [
        { appointmentDate: 'desc' },
        { timeSlot: 'asc' }
      ]
    });

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};
