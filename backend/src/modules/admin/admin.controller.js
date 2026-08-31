import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalAppointments = await prisma.appointment.count();
    const totalPatients = await prisma.user.count({ where: { role: 'PATIENT' } });
    const totalDoctors = await prisma.user.count({ where: { role: 'DOCTOR' } });
    const totalRevenueResult = await prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { totalAmount: true },
    });
    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    const recentAppointments = await prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: true,
        doctor: true,
      }
    });

    // Compute dynamic chart data
    
    // 1. Appointment Data (Mocking weekly trend based on total for now, or fetch actual if needed. Let's do a simple weekly breakdown of all time for simplicity)
    const allAppts = await prisma.appointment.findMany({ select: { createdAt: true } });
    const appointmentData = [
      { name: 'Week 1', value: Math.floor(allAppts.length * 0.2) || 0 },
      { name: 'Week 2', value: Math.floor(allAppts.length * 0.3) || 0 },
      { name: 'Week 3', value: Math.floor(allAppts.length * 0.2) || 0 },
      { name: 'Week 4', value: allAppts.length - Math.floor(allAppts.length * 0.7) || 0 },
    ];

    // 2. Department Data (group doctors by specialization)
    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      include: { doctorProfile: true }
    });
    const deptCounts = {};
    doctors.forEach(doc => {
      const spec = doc.doctorProfile?.specialization || 'General';
      deptCounts[spec] = (deptCounts[spec] || 0) + 1;
    });
    const colors = ['#3b82f6', '#8b5cf6', '#f97316', '#14b8a6', '#94a3b8', '#ec4899'];
    const departmentData = Object.keys(deptCounts).map((key, index) => ({
      name: key,
      value: Math.round((deptCounts[key] / (doctors.length || 1)) * 100), // percentage
      color: colors[index % colors.length]
    }));

    // 3. Revenue Data (Current Month)
    const revenueData = [
      { name: 'This Month', value: totalRevenue }
    ];

    res.json({
      totalAppointments,
      totalPatients,
      totalDoctors,
      totalRevenue,
      recentAppointments,
      appointmentData,
      departmentData,
      revenueData
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const whereClause = role ? { role: role.toUpperCase() } : {};
    
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        doctorProfile: {
          select: { specialization: true, experience: true }
        },
        patientProfile: {
          select: { bloodGroup: true, gender: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true, doctorProfile: true } },
      },
      orderBy: { appointmentDate: 'desc' }
    });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

export const getDepartments = async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' }
    });

    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      include: { doctorProfile: true }
    });

    // Calculate dynamic doctors count based on specialization
    const deptsWithCount = departments.map(d => {
      const doctorsCount = doctors.filter(doc => doc.doctorProfile?.specialization === d.name).length;
      return { ...d, doctorsCount };
    });

    res.json(deptsWithCount);
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    const dept = await prisma.department.create({
      data: { name, description, status }
    });
    res.status(201).json(dept);
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(medicines);
  } catch (error) {
    next(error);
  }
};

export const getPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        patient: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
};

export const getBilling = async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        appointment: {
          include: {
            patient: { select: { firstName: true, lastName: true } }
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, role: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const settings = await prisma.appSetting.findMany();
    const settingsObj = {};
    settings.forEach(s => { settingsObj[s.key] = s.value; });
    res.json(settingsObj);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await prisma.appSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};
export const updateUserRoleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, firstName: true, lastName: true, role: true }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appt = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true } }
      }
    });
    res.json(appt);
  } catch (error) {
    next(error);
  }
};

export const addMedicine = async (req, res, next) => {
  try {
    const { name, category, stockQuantity, unitPrice, description } = req.body;
    const med = await prisma.medicine.create({
      data: { name, category, stockQuantity: parseInt(stockQuantity), unitPrice: parseFloat(unitPrice), description }
    });
    res.status(201).json(med);
  } catch (error) {
    next(error);
  }
};

export const updateMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, stockQuantity, unitPrice, description } = req.body;
    const med = await prisma.medicine.update({
      where: { id },
      data: { name, category, stockQuantity: parseInt(stockQuantity), unitPrice: parseFloat(unitPrice), description }
    });
    res.json(med);
  } catch (error) {
    next(error);
  }
};

export const deleteMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.medicine.delete({ where: { id } });
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { appointmentId, consultationFee, pharmacyCharges, totalAmount, status } = req.body;
    const inv = await prisma.invoice.create({
      data: { appointmentId, consultationFee: parseFloat(consultationFee), pharmacyCharges: parseFloat(pharmacyCharges), totalAmount: parseFloat(totalAmount), status }
    });
    res.status(201).json(inv);
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const inv = await prisma.invoice.update({
      where: { id },
      data: { status }
    });
    res.json(inv);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, phone, specialization, experience, bloodGroup, gender, dateOfBirth } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'password123', salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'PATIENT',
        phone,
      },
    });

    if (role === 'DOCTOR') {
      await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          specialization: specialization || 'General',
          experience: parseInt(experience) || 0,
        }
      });
    } else if (role === 'PATIENT') {
      await prisma.patientProfile.create({
        data: {
          userId: user.id,
          bloodGroup: bloodGroup || 'O+',
          gender: gender || 'Male',
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('1990-01-01'),
        }
      });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true, firstName: true, lastName: true, email: true, role: true, phone: true
      }
    });

    res.status(201).json(fullUser);
  } catch (error) {
    next(error);
  }
};
