const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../config/jwt');

// Register new parent user
const registerParent = async (email, password, firstName, lastName, deviceId, deviceName) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user with parent profile and device in transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'PARENT',
        parentProfile: {
          create: {},
        },
      },
    });

    // Create device with pending status
    await tx.device.create({
      data: {
        userId: newUser.id,
        deviceId,
        deviceName,
        status: 'PENDING',
      },
    });

    return newUser;
  });

  return user;
};

// Login user
const loginUser = async (email, password) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

module.exports = {
  registerParent,
  loginUser,
};
