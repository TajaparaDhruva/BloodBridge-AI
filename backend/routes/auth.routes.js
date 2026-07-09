const express = require('express');
const router = express.Router();
const { signup, login, logout, getProfile } = require('../controllers/auth.controller');
const { signupValidator, loginValidator } = require('../validators/auth.validator');
const validateResults = require('../middleware/validation.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

// Public
router.post('/signup', signupValidator, validateResults, signup);
router.post('/login', loginValidator, validateResults, login);
router.post('/logout', logout);

// Protected
router.get('/profile', verifyToken, getProfile);

module.exports = router;
