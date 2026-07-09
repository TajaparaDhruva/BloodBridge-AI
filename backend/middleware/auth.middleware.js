const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/env');
const { sendError } = require('../utils/helpers');

/**
 * Verify JWT from Authorization header or cookie
 */
const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, 'No authentication token provided', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return sendError(res, 'User account not found or deactivated', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired. Please log in again', 401);
    }
    return sendError(res, 'Invalid authentication token', 401);
  }
};

/**
 * Allow access only to hospital role
 */
const isHospital = (req, res, next) => {
  if (req.user?.role === 'hospital') return next();
  return sendError(res, 'Access restricted to hospital accounts', 403);
};

/**
 * Allow access only to donor role
 */
const isDonor = (req, res, next) => {
  if (req.user?.role === 'donor') return next();
  return sendError(res, 'Access restricted to donor accounts', 403);
};

/**
 * Allow access only to admin role
 */
const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return sendError(res, 'Access restricted to admin accounts', 403);
};

/**
 * Allow hospital OR admin
 */
const isHospitalOrAdmin = (req, res, next) => {
  if (['hospital', 'admin'].includes(req.user?.role)) return next();
  return sendError(res, 'Access restricted to hospital or admin accounts', 403);
};

module.exports = { verifyToken, isHospital, isDonor, isAdmin, isHospitalOrAdmin };
