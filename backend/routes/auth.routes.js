const express = require('express');
const router = express.Router();
const { signup, login, logout, getProfile, updateProfile, changePassword } = require('../controllers/auth.controller');
const { signupValidator, loginValidator } = require('../validators/auth.validator');
const { body } = require('express-validator');
const validateResults = require('../middleware/validation.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

// Public
router.post('/signup', signupValidator, validateResults, signup);
router.post('/login', loginValidator, validateResults, login);
router.post('/logout', logout);

// Protected
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', [
  verifyToken,
  body('oldPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  validateResults
], changePassword);

module.exports = router;
