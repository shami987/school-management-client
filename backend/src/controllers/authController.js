const authService = require('../services/authService');
const { userDTO } = require('../dtos');

// Register parent
const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, deviceId, deviceName } = req.body;

    const user = await authService.registerParent(
      email,
      password,
      firstName,
      lastName,
      deviceId,
      deviceName
    );

    res.status(201).json({
      message: 'Registration successful. Please wait for device verification',
      user: userDTO(user),
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password, deviceId } = req.body;

    const { user, token } = await authService.loginUser(email, password, deviceId);

    res.json({
      message: 'Login successful',
      token,
      user: userDTO(user),
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    res.json({
      user: {
        id: req.user.userId,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
