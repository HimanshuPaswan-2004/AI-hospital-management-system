import { PrismaClient } from '@prisma/client';
import { startOfDay, addDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding appointments data...');

  // Fetch all doctors and patients
  const doctors = await prisma.user.findMany({ where: { role: 'DOCTOR' } });
  const patients = await prisma.user.findMany({ where: { role: 'PATIENT' } });

  if (doctors.length === 0 || patients.length === 0) {
    console.log('Please run seed.js first to create doctors and patients.');
    return;
  }

  const today = startOfDay(new Date());
  
  // Clear existing appointments to avoid clutter or unique constraint violations
  await prisma.appointment.deleteMany({});
  console.log('Cleared existing appointments.');

  const standardSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
  ];

  const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  let appointmentCount = 0;

  // For each doctor, let's create a few appointments
  for (const doctor of doctors) {
    // Book 3 appointments for today
    for (let i = 0; i < 3; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      await prisma.appointment.create({
        data: {
          doctorId: doctor.id,
          patientId: patient.id,
          appointmentDate: today,
          timeSlot: standardSlots[i],
          status: statuses[Math.floor(Math.random() * 2)], // PENDING or CONFIRMED for today
          reason: 'Routine checkup and general consultation.'
        }
      });
      appointmentCount++;
    }

    // Book 3 appointments for tomorrow
    const tomorrow = addDays(today, 1);
    for (let i = 4; i < 7; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      await prisma.appointment.create({
        data: {
          doctorId: doctor.id,
          patientId: patient.id,
          appointmentDate: tomorrow,
          timeSlot: standardSlots[i],
          status: 'PENDING',
          reason: 'Follow up visit regarding previous tests.'
        }
      });
      appointmentCount++;
    }
  }

  console.log(`Successfully created ${appointmentCount} appointments!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
