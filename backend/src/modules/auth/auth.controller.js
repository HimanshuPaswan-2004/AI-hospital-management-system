import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, phone } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'PATIENT',
        phone,
      },
    });

    if (user) {
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { doctorProfile: true, patientProfile: true }
      });
      res.status(201).json({
        id: fullUser.id,
        email: fullUser.email,
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        role: fullUser.role,
        doctorProfile: fullUser.doctorProfile,
        patientProfile: fullUser.patientProfile,
        token: generateToken(fullUser.id, fullUser.role),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { doctorProfile: true, patientProfile: true }
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        doctorProfile: user.doctorProfile,
        patientProfile: user.patientProfile,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { doctorProfile: true, patientProfile: true }
    });

    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export const resetPasswordDirect = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404);
      throw new Error('User not found with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};
