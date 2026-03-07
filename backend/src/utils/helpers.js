const prisma = require('../config/database');

// Get parent profile ID from user ID
const getParentProfileId = async (userId) => {
  const parentProfile = await prisma.parentProfile.findUnique({
    where: { userId },
  });
  
  if (!parentProfile) {
    throw new Error('Parent profile not found');
  }
  
  return parentProfile.id;
};

module.exports = {
  getParentProfileId,
};
