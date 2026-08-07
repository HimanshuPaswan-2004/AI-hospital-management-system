import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import prisma from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('MediAI API is running...');
});

// Database Test Route
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'success', database: 'connected' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Error Handler Middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
