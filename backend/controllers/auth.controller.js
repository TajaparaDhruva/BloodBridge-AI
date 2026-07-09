const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { sendSuccess, sendError } = require('../utils/helpers');

// Helper to sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Register a user
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'Email already in use', 400);
    }

    const user = await User.create({ name, email, password, role });

    // Initialize an empty profile for this user
    await Profile.create({ user: user._id });

    const token = signToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendSuccess(res, { user, token }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Log in a user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Account is deactivated', 403);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userObj = user.toJSON();

    return sendSuccess(res, { user: userObj, token }, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Log out user
 */
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 5000),
  });
  return sendSuccess(res, {}, 'Logged out successfully');
};

/**
 * Get current profile
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user');
    if (!profile) {
      return sendError(res, 'Profile not found', 404);
    }
    return sendSuccess(res, profile, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getProfile,
};
