import prisma from '../../config/db.js';

// @desc    Generate Invoice for an Appointment
// @route   POST /api/billing/generate/:appointmentId
// @access  Private (Admin only)
export const generateInvoice = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    const existingInvoice = await prisma.invoice.findUnique({
      where: { appointmentId }
    });

    if (existingInvoice) {
      res.status(400);
      throw new Error('Invoice already exists for this appointment');
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        doctor: { include: { doctorProfile: true } },
        prescription: true
      }
    });

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    if (appointment.status !== 'COMPLETED') {
      res.status(400);
      throw new Error('Can only generate invoice for completed appointments');
    }

    // 1. Get Consultation Fee
    const consultationFee = appointment.doctor.doctorProfile?.consultationFee || 0;

    // 2. Calculate Pharmacy Charges based on prescription
    let pharmacyCharges = 0;
    if (appointment.prescription && appointment.prescription.medicines) {
      const prescribedMeds = appointment.prescription.medicines; // Array of {name, dosage, duration}
      
      // For each medicine, look up its price in DB. 
      // Assuming duration represents days, and dosage 1-0-1 means 2 pills/day.
      // For simplicity in MVP, we just assume 1 qty = unitPrice.
      for (const pMed of prescribedMeds) {
        const dbMed = await prisma.medicine.findUnique({
          where: { name: pMed.name }
        });
        
        if (dbMed) {
          pharmacyCharges += dbMed.unitPrice;
          
          // Optionally reduce stock
          // await prisma.medicine.update({
          //   where: { id: dbMed.id },
          //   data: { stockQuantity: Math.max(0, dbMed.stockQuantity - 1) }
          // });
        }
      }
    }

    const totalAmount = consultationFee + pharmacyCharges;

    const invoice = await prisma.invoice.create({
      data: {
        appointmentId,
        consultationFee,
        pharmacyCharges,
        totalAmount,
        status: 'UNPAID'
      }
    });

    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invoices
// @route   GET /api/billing
// @access  Private (Admin only)
export const getInvoices = async (req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        appointment: {
          include: {
            patient: { select: { firstName: true, lastName: true } },
            doctor: { select: { firstName: true, lastName: true } },
            prescription: true
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

// @desc    Mark invoice as PAID
// @route   PUT /api/billing/:id/pay
// @access  Private (Admin only)
export const markInvoiceAsPaid = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status: 'PAID' }
    });

    res.json(invoice);
  } catch (error) {
    next(error);
  }
};
