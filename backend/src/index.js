import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import prisma from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('MediAI API is running...');
});

// Database Test Route
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'success', database: 'connected' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Auth Routes
import authRoutes from './modules/auth/auth.routes.js';
app.use('/api/auth', authRoutes);

// Users Routes
import usersRoutes from './modules/users/users.routes.js';
app.use('/api/users', usersRoutes);

// Doctors Routes
import doctorsRoutes from './modules/doctors/doctors.routes.js';
app.use('/api/doctors', doctorsRoutes);

// Appointments Routes
import appointmentsRoutes from './modules/appointments/appointments.routes.js';
app.use('/api/appointments', appointmentsRoutes);

// Error Handler Middleware
app.use(errorHandler);

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    await prisma.$connect();
    console.log('Database connected successfully ✅');
  } catch (error) {
    console.error('Database connection failed ❌:', error);
  }
});
