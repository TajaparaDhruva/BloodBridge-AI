const express = require('express');
const router = express.Router();
const { getStats, getAnalytics } = require('../controllers/dashboard.controller');
const { verifyToken, isHospitalOrAdmin } = require('../middleware/auth.middleware');

// Protected
router.get('/stats', verifyToken, getStats);
router.get('/analytics', verifyToken, isHospitalOrAdmin, getAnalytics);

module.exports = router;
