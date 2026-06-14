const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe };
