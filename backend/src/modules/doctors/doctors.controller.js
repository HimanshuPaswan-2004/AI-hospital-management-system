import prisma from '../../config/db.js';

// @desc    Get all verified doctors (Doctor Directory)
// @route   GET /api/doctors
// @access  Private (Patients & Admins)
export const getDoctors = async (req, res, next) => {
  try {
    const { search, specialization } = req.query;

    const query = {
      where: {
        role: 'DOCTOR',
        doctorProfile: {
          isNot: null, // Only fetch doctors who have a profile
        },
      },
      include: {
        doctorProfile: true,
      }
    };

    // Add search and filter conditions if provided
    if (search || specialization) {
      query.where.AND = [];
      
      if (search) {
        query.where.AND.push({
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ]
        });
      }
      
      if (specialization) {
        query.where.AND.push({
          doctorProfile: {
            specialization: { contains: specialization, mode: 'insensitive' }
          }
        });
      }
    }

    const doctors = await prisma.user.findMany(query);

    // Map output to exclude password and flatten slightly for easy frontend parsing
    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone,
      profile: doctor.doctorProfile
    }));

    res.json(formattedDoctors);
  } catch (error) {
    next(error);
  }
};
