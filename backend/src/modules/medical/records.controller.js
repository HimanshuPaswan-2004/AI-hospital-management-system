import prisma from '../../config/db.js';

// --- PRESCRIPTIONS ---

// @desc    Create a digital prescription
// @route   POST /api/records/prescriptions
// @access  Private (Doctors only)
export const createPrescription = async (req, res, next) => {
  try {
    const { appointmentId, symptoms, diagnosis, medicines, notes } = req.body;

    if (req.user.role !== 'DOCTOR') {
      res.status(403);
      throw new Error('Only doctors can create prescriptions');
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment || appointment.doctorId !== req.user.id) {
      res.status(404);
      throw new Error('Appointment not found or not authorized');
    }

    // Check if prescription already exists for this appointment
    const existing = await prisma.prescription.findUnique({
      where: { appointmentId }
    });

    if (existing) {
      res.status(400);
      throw new Error('Prescription already exists for this appointment');
    }

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId,
        patientId: appointment.patientId,
        doctorId: req.user.id,
        symptoms,
        diagnosis,
        medicines, // Stored as JSON array
        notes
      }
    });

    res.status(201).json(prescription);
  } catch (error) {
    next(error);
  }
};

// @desc    Get prescriptions for a patient
// @route   GET /api/records/prescriptions
// @access  Private
export const getPrescriptions = async (req, res, next) => {
  try {
    let whereClause = {};

    if (req.user.role === 'PATIENT') {
      whereClause.patientId = req.user.id;
    } else if (req.user.role === 'DOCTOR') {
      // If doctor is looking up a specific patient
      if (req.query.patientId) {
        whereClause.patientId = req.query.patientId;
        whereClause.doctorId = req.user.id;
      } else {
        whereClause.doctorId = req.user.id;
      }
    }

    const prescriptions = await prisma.prescription.findMany({
      where: whereClause,
      include: {
        doctor: { select: { firstName: true, lastName: true, doctorProfile: { select: { specialization: true } } } },
        patient: { select: { firstName: true, lastName: true } },
        appointment: { select: { appointmentDate: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
};

// --- LAB REPORTS ---

// @desc    Upload a lab report
// @route   POST /api/records/reports
// @access  Private (Patients or Admin)
export const uploadLabReport = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const { reportName, notes } = req.body;
    let patientId = req.user.id; // Assume patient is uploading

    // If Admin is uploading for someone else
    if (req.user.role === 'ADMIN' && req.body.patientId) {
      patientId = req.body.patientId;
    }

    const report = await prisma.labReport.create({
      data: {
        patientId,
        reportName: reportName || 'Lab Report',
        fileUrl: `/uploads/${req.file.filename}`,
        notes
      }
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

// @desc    Get lab reports for a patient
// @route   GET /api/records/reports
// @access  Private
export const getLabReports = async (req, res, next) => {
  try {
    let whereClause = {};

    if (req.user.role === 'PATIENT') {
      whereClause.patientId = req.user.id;
    } else if (req.user.role === 'DOCTOR' && req.query.patientId) {
      whereClause.patientId = req.query.patientId;
    } else if (req.user.role === 'ADMIN') {
      if (req.query.patientId) whereClause.patientId = req.query.patientId;
    }

    const reports = await prisma.labReport.findMany({
      where: whereClause,
      include: {
        patient: { select: { firstName: true, lastName: true } }
      },
      orderBy: { dateUploaded: 'desc' }
    });

    res.json(reports);
  } catch (error) {
    next(error);
  }
};
