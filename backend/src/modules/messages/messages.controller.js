import prisma from '../../config/db.js';

// @desc    Get contacts (users you have messages with or appointments with)
// @route   GET /api/messages/contacts
// @access  Private
export const getContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let contactsMap = new Map();

    if (req.user.role === 'DOCTOR') {
      // Get all patients with appointments
      const appointments = await prisma.appointment.findMany({
        where: { doctorId: userId },
        include: { patient: true }
      });
      appointments.forEach(apt => {
        contactsMap.set(apt.patient.id, {
          id: apt.patient.id,
          name: `${apt.patient.firstName} ${apt.patient.lastName}`,
          initials: `${apt.patient.firstName[0]}${apt.patient.lastName[0]}`,
          color: 'bg-blue-100 text-blue-600',
          unread: 0
        });
      });
    } else if (req.user.role === 'PATIENT') {
      // Get all doctors with appointments
      const appointments = await prisma.appointment.findMany({
        where: { patientId: userId },
        include: { doctor: true }
      });
      appointments.forEach(apt => {
        contactsMap.set(apt.doctor.id, {
          id: apt.doctor.id,
          name: `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`,
          initials: `${apt.doctor.firstName[0]}${apt.doctor.lastName[0]}`,
          color: 'bg-indigo-100 text-indigo-600',
          unread: 0
        });
      });
    } else if (req.user.role === 'ADMIN') {
      // Admin can chat with Doctors and Receptionists
      const staff = await prisma.user.findMany({
        where: { role: { in: ['DOCTOR', 'RECEPTIONIST'] } }
      });
      staff.forEach(user => {
        const title = user.role === 'DOCTOR' ? 'Dr. ' : '';
        contactsMap.set(user.id, {
          id: user.id,
          name: `${title}${user.firstName} ${user.lastName}`,
          initials: `${user.firstName[0]}${user.lastName[0]}`,
          color: user.role === 'DOCTOR' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600',
          unread: 0
        });
      });
    }

    // Now get the latest message for each contact
    const contacts = Array.from(contactsMap.values());
    
    for (let contact of contacts) {
      const latestMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: contact.id },
            { senderId: contact.id, receiverId: userId }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
      
      if (latestMessage) {
        contact.lastMessage = latestMessage.content;
        contact.time = latestMessage.createdAt;
      } else {
        contact.lastMessage = 'Say hello!';
        contact.time = null;
      }
    }

    // Sort by most recent message
    contacts.sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return new Date(b.time) - new Date(a.time);
    });

    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat history with a specific user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'receiverId and content are required' });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content
      }
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};
