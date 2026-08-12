import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find a doctor and a patient
  const doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' } });
  const patient = await prisma.user.findFirst({ where: { role: 'PATIENT' } });

  if (!doctor || !patient) {
    console.log('Need at least one doctor and one patient in the DB.');
    return;
  }

  // Generate for the last 6 days (not today, today already has data)
  const today = new Date();
  
  for (let i = 1; i <= 6; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Create 1-3 appointments per day
    const numAppts = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < numAppts; j++) {
      // Create Appointment
      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          appointmentDate: d,
          timeSlot: `${9 + j}:00 AM`, // Just dummy time
          status: 'COMPLETED',
          reason: 'Routine checkup (Seeded)',
          createdAt: d,
          updatedAt: d,
        }
      });

      // Create Paid Invoice for it
      const consultationFee = 500;
      const pharmacyCharges = Math.floor(Math.random() * 500);
      
      await prisma.invoice.create({
        data: {
          appointmentId: appointment.id,
          consultationFee,
          pharmacyCharges,
          totalAmount: consultationFee + pharmacyCharges,
          status: 'PAID',
          issuedAt: d,
          updatedAt: d,
        }
      });
    }
  }

  console.log('Seeded analytics data successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
