const express = require('express');
const router = express.Router();
const { registerHospital, getHospitals } = require('../controllers/hospital.controller');
const { registerHospitalValidator } = require('../validators/hospital.validator');
const validateResults = require('../middleware/validation.middleware');
const { verifyToken, isHospital } = require('../middleware/auth.middleware');

// Protected
router.post('/register', verifyToken, isHospital, registerHospitalValidator, validateResults, registerHospital);
router.get('/', verifyToken, getHospitals);

module.exports = router;
