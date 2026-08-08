import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with test data...');

  // Clear existing data (optional, but good for a fresh seed)
  // Commented out to prevent accidental deletion of user's own data, 
  // we will just add new ones.

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // Admin
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Admin',
        role: 'ADMIN',
      }
    });
    console.log('Created admin: admin@example.com');
  }

  // Doctors
  const doctorsData = [
    {
      email: 'dr.smith@example.com',
      firstName: 'John',
      lastName: 'Smith',
      role: 'DOCTOR',
      profile: {
        specialization: 'Cardiologist',
        experience: 15,
        qualification: 'MBBS, MD (Cardiology)',
        consultationFee: 150,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        bio: 'Expert in treating heart diseases and performing surgeries.'
      }
    },
    {
      email: 'dr.jones@example.com',
      firstName: 'Sarah',
      lastName: 'Jones',
      role: 'DOCTOR',
      profile: {
        specialization: 'Dermatologist',
        experience: 8,
        qualification: 'MBBS, MD (Dermatology)',
        consultationFee: 100,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        bio: 'Specialist in skin conditions and cosmetic treatments.'
      }
    },
    {
      email: 'dr.patel@example.com',
      firstName: 'Raj',
      lastName: 'Patel',
      role: 'DOCTOR',
      profile: {
        specialization: 'Neurologist',
        experience: 12,
        qualification: 'MBBS, DM (Neurology)',
        consultationFee: 200,
        availableDays: ['Monday', 'Tuesday', 'Wednesday'],
        bio: 'Experienced in treating neurological disorders and brain surgeries.'
      }
    },
    {
      email: 'dr.lee@example.com',
      firstName: 'Emily',
      lastName: 'Lee',
      role: 'DOCTOR',
      profile: {
        specialization: 'Pediatrician',
        experience: 5,
        qualification: 'MBBS, MD (Pediatrics)',
        consultationFee: 80,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        bio: 'Dedicated pediatrician providing comprehensive care for children.'
      }
    },
    {
      email: 'dr.garcia@example.com',
      firstName: 'Carlos',
      lastName: 'Garcia',
      role: 'DOCTOR',
      profile: {
        specialization: 'Orthopedic',
        experience: 20,
        qualification: 'MBBS, MS (Orthopedics)',
        consultationFee: 180,
        availableDays: ['Wednesday', 'Friday', 'Saturday'],
        bio: 'Senior orthopedic surgeon specializing in joint replacements.'
      }
    },
    {
      email: 'dr.wilson@example.com',
      firstName: 'Amanda',
      lastName: 'Wilson',
      role: 'DOCTOR',
      profile: {
        specialization: 'Psychiatrist',
        experience: 10,
        qualification: 'MBBS, MD (Psychiatry)',
        consultationFee: 120,
        availableDays: ['Monday', 'Thursday'],
        bio: 'Compassionate psychiatrist helping patients with mental health issues.'
      }
    },
    {
      email: 'dr.brown@example.com',
      firstName: 'David',
      lastName: 'Brown',
      role: 'DOCTOR',
      profile: {
        specialization: 'General Physician',
        experience: 7,
        qualification: 'MBBS',
        consultationFee: 50,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        bio: 'Friendly neighborhood physician for all your primary healthcare needs.'
      }
    }
  ];

  for (const doc of doctorsData) {
    const existing = await prisma.user.findUnique({ where: { email: doc.email } });
    if (!existing) {
      const user = await prisma.user.create({
        data: {
          email: doc.email,
          password: hashedPassword,
          firstName: doc.firstName,
          lastName: doc.lastName,
          role: doc.role,
          phone: `+123456789${Math.floor(Math.random() * 10)}`,
        }
      });
      await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          specialization: doc.profile.specialization,
          experience: doc.profile.experience,
          qualification: doc.profile.qualification,
          consultationFee: doc.profile.consultationFee,
          bio: doc.profile.bio,
          availableDays: doc.profile.availableDays,
        }
      });
      console.log(`Created doctor: Dr. ${doc.firstName} ${doc.lastName}`);
    }
  }

  // Patients
  const patientsData = [
    { email: 'patient1@example.com', firstName: 'Alice', lastName: 'Johnson' },
    { email: 'patient2@example.com', firstName: 'Bob', lastName: 'Williams' },
    { email: 'patient3@example.com', firstName: 'Charlie', lastName: 'Davis' },
    { email: 'patient4@example.com', firstName: 'Diana', lastName: 'Miller' },
    { email: 'patient5@example.com', firstName: 'Ethan', lastName: 'Moore' },
  ];

  for (const pat of patientsData) {
    const existing = await prisma.user.findUnique({ where: { email: pat.email } });
    if (!existing) {
      const user = await prisma.user.create({
        data: {
          email: pat.email,
          password: hashedPassword,
          firstName: pat.firstName,
          lastName: pat.lastName,
          role: 'PATIENT',
          phone: `+198765432${Math.floor(Math.random() * 10)}`,
        }
      });
      
      await prisma.patientProfile.create({
        data: {
          userId: user.id,
          dateOfBirth: new Date(1990 - Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          address: '123 Fake Street, Cityville',
          bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'O-'][Math.floor(Math.random() * 5)],
          allergies: ['Dust', 'Pollen', 'Peanuts'].slice(0, Math.floor(Math.random() * 3)),
        }
      });
      console.log(`Created patient: ${pat.firstName} ${pat.lastName}`);
    }
  }

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
