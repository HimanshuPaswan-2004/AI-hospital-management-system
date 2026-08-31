import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const generateUsers = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Doctors
    const doctors = [
      { firstName: 'Amit', lastName: 'Sharma', email: 'amit.cardio@mediai.com', spec: 'Cardiology' },
      { firstName: 'Neha', lastName: 'Verma', email: 'neha.neuro@mediai.com', spec: 'Neurology' },
      { firstName: 'Rahul', lastName: 'Singh', email: 'rahul.ortho@mediai.com', spec: 'Orthopedics' },
      { firstName: 'Priya', lastName: 'Patel', email: 'priya.pedia@mediai.com', spec: 'Pediatrics' },
      { firstName: 'Karan', lastName: 'Malhotra', email: 'karan.derma@mediai.com', spec: 'Dermatology' },
    ];

    console.log('--- DOCTOR CREDENTIALS (Password: password123) ---');
    for (const doc of doctors) {
      const user = await prisma.user.upsert({
        where: { email: doc.email },
        update: {},
        create: {
          firstName: doc.firstName,
          lastName: doc.lastName,
          email: doc.email,
          password,
          role: 'DOCTOR',
          doctorProfile: {
            create: {
              specialization: doc.spec,
              experience: Math.floor(Math.random() * 15) + 5,
              qualification: 'MBBS, MD',
              consultationFee: 500,
              availableDays: ['Monday', 'Wednesday', 'Friday'],
            }
          }
        }
      });
      console.log(`Email: ${user.email} | Spec: ${doc.spec}`);
    }

    // Patients
    const patients = [
      { firstName: 'Ravi', lastName: 'Kumar', email: 'ravi.k@example.com' },
      { firstName: 'Sita', lastName: 'Devi', email: 'sita.d@example.com' },
      { firstName: 'Vikram', lastName: 'Joshi', email: 'vikram.j@example.com' },
      { firstName: 'Anjali', lastName: 'Rao', email: 'anjali.r@example.com' },
      { firstName: 'Suresh', lastName: 'Nair', email: 'suresh.n@example.com' },
    ];

    console.log('\n--- PATIENT CREDENTIALS (Password: password123) ---');
    for (const pat of patients) {
      const user = await prisma.user.upsert({
        where: { email: pat.email },
        update: {},
        create: {
          firstName: pat.firstName,
          lastName: pat.lastName,
          email: pat.email,
          password,
          role: 'PATIENT',
          patientProfile: {
            create: {
              dateOfBirth: new Date(1990 - Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), 1),
              gender: Math.random() > 0.5 ? 'Male' : 'Female',
              bloodGroup: 'O+',
            }
          }
        }
      });
      console.log(`Email: ${user.email}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

generateUsers();
