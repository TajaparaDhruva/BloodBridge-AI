const logger = require('../utils/logger');
const { sendError } = require('../utils/helpers');
const { NODE_ENV } = require('../config/env');

/**
 * Global Express Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return sendError(res, 'Validation Error', 400, messages);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    let friendlyField = field;
    if (field === 'registrationNumber') friendlyField = 'Registration / License Number';
    if (field === 'email') friendlyField = 'Email Address';
    return sendError(res, `This ${friendlyField} is already registered. Please use another value.`, 400);
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, `Resource not found with id of ${err.value}`, 404);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid authentication token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token has expired. Please log in again', 401);
  }

  // Default server error
  const message = NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  return sendError(res, message, err.statusCode || 500);
};

module.exports = errorHandler;
