import prisma from '../../config/db.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    // 1. Total Appointments
    const totalAppointments = await prisma.appointment.count();

    // 2. Appointments by Status
    const appointmentsByStatusRaw = await prisma.appointment.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });
    
    // Format to a more friendly structure for frontend
    const appointmentsByStatus = appointmentsByStatusRaw.map(item => ({
      status: item.status,
      count: item._count.status,
    }));

    // 3. Total Revenue
    const totalRevenueResult = await prisma.invoice.aggregate({
      where: {
        status: 'PAID',
      },
      _sum: {
        totalAmount: true,
      },
    });
    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    // 4. Revenue by Date (last 30 days or all time)
    // We will group by date in JS since Prisma doesn't support grouping by date part easily across all DBs
    const paidInvoices = await prisma.invoice.findMany({
      where: {
        status: 'PAID',
      },
      select: {
        totalAmount: true,
        issuedAt: true,
      },
      orderBy: {
        issuedAt: 'asc',
      }
    });

    const revenueByDateMap = {};
    paidInvoices.forEach(invoice => {
      // Format date to YYYY-MM-DD
      const dateString = invoice.issuedAt.toISOString().split('T')[0];
      if (!revenueByDateMap[dateString]) {
        revenueByDateMap[dateString] = 0;
      }
      revenueByDateMap[dateString] += invoice.totalAmount;
    });

    const revenueByDate = Object.keys(revenueByDateMap).map(date => ({
      date,
      revenue: revenueByDateMap[date],
    }));

    // Optionally: Total Doctors, Total Patients
    const totalDoctors = await prisma.user.count({ where: { role: 'DOCTOR' } });
    const totalPatients = await prisma.user.count({ where: { role: 'PATIENT' } });

    res.status(200).json({
      status: 'success',
      data: {
        totalAppointments,
        totalRevenue,
        appointmentsByStatus,
        revenueByDate,
        totalDoctors,
        totalPatients,
      },
    });
  } catch (error) {
    next(error);
  }
};
