const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Hash password using SHA-512 then bcrypt for additional security
const hashPassword = async (password) => {
  // First apply SHA-512
  const sha512Hash = crypto.createHash('sha512').update(password).digest('hex');
  // Then apply bcrypt for additional security layer
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(sha512Hash, salt);
};

// Compare password with hashed password
const comparePassword = async (password, hashedPassword) => {
  const sha512Hash = crypto.createHash('sha512').update(password).digest('hex');
  return await bcrypt.compare(sha512Hash, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
