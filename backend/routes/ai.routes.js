const express = require('express');
const router = express.Router();
const { matchDonors } = require('../controllers/ai.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Protected
router.post('/match', verifyToken, matchDonors);

module.exports = router;
