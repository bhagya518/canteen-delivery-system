const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const auth = require('../middleware/auth');
// Protect route:
router.get('/my-profile', auth, async (req, res) => {
  // req.user.id is available
});

const normalizeEmail = (email = '') => email.trim().toLowerCase();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const normalizedEmail = normalizeEmail(email);

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name: name.trim(), email: normalizedEmail, password });
    await user.save();

    // (optional) return token on register
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(201).json({ message: 'User registered', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // return token + minimal user info
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
