import prisma from '../../config/db.js';

// @desc    Get all verified doctors (Doctor Directory)
// @route   GET /api/doctors
// @access  Private (Patients & Admins)
export const getDoctors = async (req, res, next) => {
  try {
    const { search, specialization } = req.query;

    const query = {
      where: {
        role: 'DOCTOR',
        doctorProfile: {
          isNot: null, // Only fetch doctors who have a profile
        },
      },
      include: {
        doctorProfile: true,
      }
    };

    // Add search and filter conditions if provided
    if (search || specialization) {
      query.where.AND = [];
      
      if (search) {
        // Remove 'dr.' or 'dr ' prefix case-insensitively and trim
        const cleanSearch = search.replace(/^dr\.?\s*/i, '').trim();
        const searchParts = cleanSearch.split(/\s+/);

        const nameConditions = searchParts.map(part => ({
          OR: [
            { firstName: { contains: part, mode: 'insensitive' } },
            { lastName: { contains: part, mode: 'insensitive' } },
          ]
        }));
        
        query.where.AND.push(...nameConditions);
      }
      
      if (specialization) {
        query.where.AND.push({
          doctorProfile: {
            specialization: { contains: specialization, mode: 'insensitive' }
          }
        });
      }
    }

    const doctors = await prisma.user.findMany(query);

    // Map output to exclude password and flatten slightly for easy frontend parsing
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone,
      profile: doctor.doctorProfile
    }));

    res.json(formattedDoctors);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard aggregate stats for the doctor
// @route   GET /api/doctors/dashboard
// @access  Private (Doctors only)
export const getDashboardStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'DOCTOR') {
      res.status(403);
      throw new Error('Only doctors can access this resource');
    }

    const doctorId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Today's Appointments
    const todaysAppointmentsCount = await prisma.appointment.count({
      where: {
        doctorId,
        appointmentDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    // 2. Total Patients (Unique patients who have an appointment with this doctor)
    // Prisma doesn't support distinct count easily with relations, so we fetch distinct patientIds
    const uniquePatients = await prisma.appointment.findMany({
      where: { doctorId },
      select: { patientId: true },
      distinct: ['patientId']
    });
    const totalPatientsCount = uniquePatients.length;

    // 3. Pending Reports (For simplicity, count of all LabReports of these unique patients)
    const patientIds = uniquePatients.map(p => p.patientId);
    const pendingReportsCount = await prisma.labReport.count({
      where: {
        patientId: { in: patientIds }
      }
    });

    // 4. Consultations (Completed appointments)
    const consultationsCount = await prisma.appointment.count({
      where: {
        doctorId,
        status: 'COMPLETED'
      }
    });

    // 5. Chart Data (Appointments per day for the last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    
    const weeklyAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: sevenDaysAgo,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      select: {
        appointmentDate: true
      }
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartDataMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      chartDataMap[dayName] = 0;
    }

    weeklyAppointments.forEach(apt => {
      const aptDate = new Date(apt.appointmentDate);
      const dayName = days[aptDate.getDay()];
      if (chartDataMap[dayName] !== undefined) {
        chartDataMap[dayName]++;
      }
    });

    const chartData = Object.keys(chartDataMap).map(key => ({
      name: key,
      appointments: chartDataMap[key]
    }));

    res.json({
      todaysAppointments: todaysAppointmentsCount,
      totalPatients: totalPatientsCount,
      pendingReports: pendingReportsCount,
      consultations: consultationsCount,
      chartData: chartData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique patients for the doctor
// @route   GET /api/doctors/patients
// @access  Private (Doctors only)
export const getDoctorPatients = async (req, res, next) => {
  try {
    if (req.user.role !== 'DOCTOR') {
      res.status(403);
      throw new Error('Only doctors can access this resource');
    }

    const doctorId = req.user.id;

    // Fetch appointments to get distinct patients, including their latest appointment
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
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
      orderBy: {
        appointmentDate: 'desc'
      }
    });

    // Extract unique patients and keep the most recent appointment date as lastVisit
    const patientMap = new Map();
    
    appointments.forEach(apt => {
      if (!patientMap.has(apt.patient.id)) {
        patientMap.set(apt.patient.id, {
          ...apt.patient,
          lastVisit: apt.appointmentDate
        });
      }
    });

    const patients = Array.from(patientMap.values());

    res.json(patients);
  } catch (error) {
    next(error);
  }
};
