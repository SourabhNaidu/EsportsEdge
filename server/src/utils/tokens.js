const jwt = require('jsonwebtoken');

function signAuthToken(user) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  );
}

module.exports = {
  signAuthToken,
};

