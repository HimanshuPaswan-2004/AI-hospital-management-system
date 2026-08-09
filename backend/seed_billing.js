import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding billing data...');

  // 1. Create a Patient
  let patient = await prisma.user.findFirst({ where: { role: 'PATIENT' } });
  if (!patient) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    patient = await prisma.user.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'patient@example.com',
        password: hashedPassword,
        role: 'PATIENT',
        patientProfile: {
          create: {
            dateOfBirth: new Date('1990-01-01'),
            gender: 'Male',
            bloodGroup: 'O+',
          }
        }
      }
    });
    console.log('Created dummy patient');
  }

  // 2. Create a Doctor
  let doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' }, include: { doctorProfile: true } });
  if (!doctor) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    doctor = await prisma.user.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Smith',
        email: 'doctor@example.com',
        password: hashedPassword,
        role: 'DOCTOR',
        doctorProfile: {
          create: {
            specialization: 'Cardiologist',
            experience: 10,
            qualification: 'MD, DM',
            consultationFee: 500.0,
            availableDays: ['Monday', 'Wednesday', 'Friday'],
          }
        }
      },
      include: { doctorProfile: true }
    });
    console.log('Created dummy doctor');
  }

  // 3. Create a completed appointment
  // Check if one exists between them
  let appointment = await prisma.appointment.findFirst({
    where: { patientId: patient.id, doctorId: doctor.id, status: 'COMPLETED' }
  });

  if (!appointment) {
    // We need a unique time block
    appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentDate: new Date(),
        timeSlot: '10:00 AM',
        status: 'COMPLETED',
        reason: 'Regular Checkup'
      }
    });
    console.log('Created completed appointment');
  }

  // 4. Generate an invoice for this appointment
  let invoice = await prisma.invoice.findFirst({
    where: { appointmentId: appointment.id }
  });

  if (!invoice) {
    const consultationFee = doctor.doctorProfile?.consultationFee || 500.0;
    const pharmacyCharges = 150.0; // dummy value
    
    invoice = await prisma.invoice.create({
      data: {
        appointmentId: appointment.id,
        consultationFee,
        pharmacyCharges,
        totalAmount: consultationFee + pharmacyCharges,
        status: 'UNPAID' // So the user can click 'Mark as Paid'
      }
    });
    console.log('Created Invoice data: ', invoice);
  } else {
    console.log('Invoice already exists: ', invoice);
  }

  // Create another PAID invoice for variety
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  let appointment2 = await prisma.appointment.findFirst({
    where: { patientId: patient.id, doctorId: doctor.id, appointmentDate: yesterday }
  });

  if (!appointment2) {
    appointment2 = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentDate: yesterday,
        timeSlot: '11:00 AM',
        status: 'COMPLETED',
        reason: 'Follow-up'
      }
    });
    
    const consultationFee = doctor.doctorProfile?.consultationFee || 500.0;
    
    await prisma.invoice.create({
      data: {
        appointmentId: appointment2.id,
        consultationFee,
        pharmacyCharges: 0,
        totalAmount: consultationFee,
        status: 'PAID'
      }
    });
    console.log('Created a PAID invoice as well.');
  }

  console.log('Billing data seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
