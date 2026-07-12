const express = require('express');
const router = express.Router();
const { matchDonors, chatWithAI } = require('../controllers/ai.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Protected
router.post('/match', verifyToken, matchDonors);
router.post('/chat', chatWithAI);

module.exports = router;
