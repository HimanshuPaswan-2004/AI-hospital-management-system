import prisma from '../../config/db.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        doctorProfile: true,
        patientProfile: true,
      }
    });

    if (user) {
      // Remove password from response
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (user) {
      const { firstName, lastName, phone, profileData } = req.body;

      // Update basic user info
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          phone: phone || user.phone,
        }
      });

      // Update Role-Specific Profile Info
      if (profileData && profileData.specialization !== undefined) {
        await prisma.doctorProfile.upsert({
          where: { userId: user.id },
          update: {
            specialization: profileData.specialization,
            experience: parseInt(profileData.experience) || 0,
            qualification: profileData.qualification,
            consultationFee: parseFloat(profileData.consultationFee) || 0,
            bio: profileData.bio,
            availableDays: profileData.availableDays || [],
          },
          create: {
            userId: user.id,
            specialization: profileData.specialization || '',
            experience: parseInt(profileData.experience) || 0,
            qualification: profileData.qualification || '',
            consultationFee: parseFloat(profileData.consultationFee) || 0,
            bio: profileData.bio || '',
            availableDays: profileData.availableDays || [],
          }
        });
      } 
      
      if (profileData && profileData.bloodGroup !== undefined) {
        await prisma.patientProfile.upsert({
          where: { userId: user.id },
          update: {
            dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
            gender: profileData.gender,
            address: profileData.address,
            bloodGroup: profileData.bloodGroup,
            allergies: profileData.allergies || [],
          },
          create: {
            userId: user.id,
            dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : null,
            gender: profileData.gender || '',
            address: profileData.address || '',
            bloodGroup: profileData.bloodGroup || '',
            allergies: profileData.allergies || [],
          }
        });
      }

      // Fetch the updated user with profiles
      const fullyUpdatedUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          doctorProfile: true,
          patientProfile: true,
        }
      });

      const { password, ...userWithoutPassword } = fullyUpdatedUser;
      res.json(userWithoutPassword);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
