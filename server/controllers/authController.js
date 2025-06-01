const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken  = require('../utils/auth.js');

// Google OAuth callback
exports.googleAuthCallback = async (req, res) => {
   
  try {
    // 👈 Add this
    if (!req.user) return res.status(401).json({ message: 'No user authenticated' });
    const token = generateToken(req.user);
    res.cookie('token', token, { httpOnly: true });
    res.redirect(process.env.FRONTEND_URL);
  } catch (err) {
    res.status(500).json({ message: 'Authentication failed1' });
  }
};

// Local login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true }).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

// Local signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true }).status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
};

// Get current user
exports.getMe = async (req, res) => {
 
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};