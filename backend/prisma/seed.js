import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with realistic data...');

  // Clean existing data to avoid conflicts (Cascade deletes will handle relations)
  await prisma.invoice.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.labReport.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.medicine.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  // 1. Create Doctors
  console.log('👨‍⚕️ Creating Doctors...');
  const doctor1 = await prisma.user.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'dr.jenkins@example.com',
      password,
      role: 'DOCTOR',
      phone: '9876543210',
      doctorProfile: {
        create: {
          specialization: 'Cardiologist',
          experience: 12,
          qualification: 'MBBS, MD (Cardiology), FACC',
          consultationFee: 150.0,
          bio: 'Dr. Jenkins is a board-certified cardiologist with over a decade of experience treating complex heart conditions. She specializes in preventive cardiology and heart failure management.',
          availableDays: ['Monday', 'Wednesday', 'Friday'],
        }
      }
    }
  });

  const doctor2 = await prisma.user.create({
    data: {
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'dr.vance@example.com',
      password,
      role: 'DOCTOR',
      phone: '8765432109',
      doctorProfile: {
        create: {
          specialization: 'Neurologist',
          experience: 8,
          qualification: 'MBBS, DM (Neurology)',
          consultationFee: 200.0,
          bio: 'Dr. Vance specializes in neurological disorders, including migraines, epilepsy, and multiple sclerosis. He is known for his compassionate patient care and innovative treatment approaches.',
          availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        }
      }
    }
  });

  // 2. Create Patients
  console.log('🧑‍🤝‍🧑 Creating Patients...');
  const patient1 = await prisma.user.create({
    data: {
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      password,
      role: 'PATIENT',
      phone: '7654321098',
      patientProfile: {
        create: {
          dateOfBirth: new Date('1990-05-14'),
          gender: 'Female',
          address: '123 Maple Street, Springfield',
          bloodGroup: 'O+',
          allergies: ['Penicillin', 'Peanuts']
        }
      }
    }
  });

  const patient2 = await prisma.user.create({
    data: {
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'robert.williams@example.com',
      password,
      role: 'PATIENT',
      phone: '6543210987',
      patientProfile: {
        create: {
          dateOfBirth: new Date('1982-11-22'),
          gender: 'Male',
          address: '456 Oak Avenue, Springfield',
          bloodGroup: 'A-',
          allergies: []
        }
      }
    }
  });

  const patient3 = await prisma.user.create({
    data: {
      firstName: 'Jessica',
      lastName: 'Miller',
      email: 'jessica.miller@example.com',
      password,
      role: 'PATIENT',
      phone: '5432109876',
      patientProfile: {
        create: {
          dateOfBirth: new Date('1995-08-09'),
          gender: 'Female',
          address: '789 Pine Road, Springfield',
          bloodGroup: 'B+',
          allergies: ['Dust Mites']
        }
      }
    }
  });

  // 3. Create Medicines Inventory
  console.log('💊 Creating Medicines Inventory...');
  await prisma.medicine.createMany({
    data: [
      { name: 'Atorvastatin 20mg', category: 'Cardiovascular', stockQuantity: 500, unitPrice: 1.5, description: 'Lowers cholesterol levels' },
      { name: 'Metoprolol 50mg', category: 'Cardiovascular', stockQuantity: 300, unitPrice: 2.0, description: 'Beta blocker for high blood pressure' },
      { name: 'Sumatriptan 50mg', category: 'Neurological', stockQuantity: 200, unitPrice: 15.0, description: 'Migraine relief' },
      { name: 'Gabapentin 300mg', category: 'Neurological', stockQuantity: 400, unitPrice: 3.5, description: 'Nerve pain medication' },
      { name: 'Amoxicillin 500mg', category: 'Antibiotic', stockQuantity: 1000, unitPrice: 1.0, description: 'Treats bacterial infections' }
    ]
  });

  // 4. Create Appointments
  console.log('📅 Creating Appointments and Prescriptions...');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastDate1 = new Date(today);
  pastDate1.setDate(today.getDate() - 10);
  
  const pastDate2 = new Date(today);
  pastDate2.setDate(today.getDate() - 3);

  const futureDate1 = new Date(today);
  futureDate1.setDate(today.getDate() + 2);

  const futureDate2 = new Date(today);
  futureDate2.setDate(today.getDate() + 5);

  // Past Appointment 1 (Completed with Prescription & Invoice)
  const appt1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      appointmentDate: pastDate1,
      timeSlot: '10:00 AM',
      status: 'COMPLETED',
      reason: 'Frequent chest pain and shortness of breath'
    }
  });

  await prisma.prescription.create({
    data: {
      appointmentId: appt1.id,
      patientId: patient1.id,
      doctorId: doctor1.id,
      symptoms: 'Mild chest discomfort, elevated blood pressure',
      diagnosis: 'Stage 1 Hypertension',
      medicines: [
        { name: 'Metoprolol 50mg', dosage: '1 tablet', duration: '30 days', instructions: 'Take once daily in the morning after food' }
      ],
      notes: 'Advised low sodium diet and 30 mins of moderate exercise daily. Return for followup in 1 month.'
    }
  });

  await prisma.invoice.create({
    data: {
      appointmentId: appt1.id,
      consultationFee: 150.0,
      pharmacyCharges: 60.0,
      totalAmount: 210.0,
      status: 'PAID'
    }
  });

  // Past Appointment 2 (Completed with Prescription & Invoice)
  const appt2 = await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      appointmentDate: pastDate2,
      timeSlot: '02:30 PM',
      status: 'COMPLETED',
      reason: 'Severe chronic migraines'
    }
  });

  await prisma.prescription.create({
    data: {
      appointmentId: appt2.id,
      patientId: patient2.id,
      doctorId: doctor2.id,
      symptoms: 'Throbbing pain on right side of head, sensitivity to light',
      diagnosis: 'Chronic Migraine without aura',
      medicines: [
        { name: 'Sumatriptan 50mg', dosage: '1 tablet', duration: 'As needed', instructions: 'Take at the onset of a migraine. Do not exceed 200mg in 24 hours.' }
      ],
      notes: 'Keep a headache diary to identify potential triggers.'
    }
  });

  await prisma.invoice.create({
    data: {
      appointmentId: appt2.id,
      consultationFee: 200.0,
      pharmacyCharges: 45.0,
      totalAmount: 245.0,
      status: 'PAID'
    }
  });

  // Future Appointment 1 (Confirmed)
  await prisma.appointment.create({
    data: {
      patientId: patient3.id,
      doctorId: doctor1.id,
      appointmentDate: futureDate1,
      timeSlot: '11:00 AM',
      status: 'CONFIRMED',
      reason: 'Routine cardiac checkup'
    }
  });

  // Future Appointment 2 (Pending)
  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor2.id,
      appointmentDate: futureDate2,
      timeSlot: '04:00 PM',
      status: 'PENDING',
      reason: 'Numbness in left arm'
    }
  });

  // 5. Create Lab Reports
  console.log('🔬 Creating Lab Reports...');
  await prisma.labReport.create({
    data: {
      patientId: patient1.id,
      reportName: 'Lipid Panel - Total Cholesterol',
      fileUrl: '/uploads/reports/dummy_lipid_panel.pdf',
      notes: 'Cholesterol levels are slightly elevated. Needs dietary modification.'
    }
  });

  await prisma.labReport.create({
    data: {
      patientId: patient2.id,
      reportName: 'Brain MRI Results',
      fileUrl: '/uploads/reports/dummy_mri_results.pdf',
      notes: 'MRI shows no structural abnormalities. Consistent with migraine diagnosis.'
    }
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
