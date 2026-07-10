const express = require('express');
const router = express.Router();
const {
  registerHospital,
  getHospitals,
  getHospitalById,
  getHospitalMe,
  updateHospital,
  deleteHospital,
} = require('../controllers/hospital.controller');
const { registerHospitalValidator } = require('../validators/hospital.validator');
const validateResults = require('../middleware/validation.middleware');
const { verifyToken, isHospital } = require('../middleware/auth.middleware');

// Protected
router.post('/register', verifyToken, isHospital, registerHospitalValidator, validateResults, registerHospital);
router.get('/me', verifyToken, getHospitalMe);
router.get('/', verifyToken, getHospitals);
router.get('/:id', verifyToken, getHospitalById);
router.put('/:id', verifyToken, updateHospital);
router.delete('/:id', verifyToken, deleteHospital);

module.exports = router;
