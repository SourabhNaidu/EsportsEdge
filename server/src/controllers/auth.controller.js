const bcrypt = require('bcrypt');
const User = require('../models/User');
const { loginSchema, registerSchema } = require('../schemas/auth.schema');
const { signAuthToken } = require('../utils/tokens');

const SALT_ROUNDS = 12;

function formatZodError(error) {
  return error.issues.map((issue) => issue.message);
}

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid registration details',
      errors: formatZodError(parsed.error),
    });
  }

  const { username, email, password, adminInviteCode } = parsed.data;
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(409).json({
      status: 'error',
      message: 'Username or email is already in use',
    });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const role =
    process.env.ADMIN_INVITE_CODE && adminInviteCode === process.env.ADMIN_INVITE_CODE
      ? 'admin'
      : 'user';

  const user = await User.create({
    username,
    email,
    passwordHash,
    role,
  });
  const token = signAuthToken(user);

  return res.status(201).json({
    status: 'success',
    message: 'Account created',
    token,
    user: user.toSafeObject(),
  });
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid login details',
      errors: formatZodError(parsed.error),
    });
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid email or password',
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid email or password',
    });
  }

  const token = signAuthToken(user);

  return res.json({
    status: 'success',
    message: 'Logged in',
    token,
    user: user.toSafeObject(),
  });
}

function getProfile(req, res) {
  return res.json({
    status: 'success',
    user: req.user.toSafeObject(),
  });
}

module.exports = {
  register,
  login,
  getProfile,
};
