const express = require('express');
const router = express.Router();
const {
  registerDonor,
  getDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
  getDonorMe,
} = require('../controllers/donor.controller');
const { registerDonorValidator } = require('../validators/donor.validator');
const validateResults = require('../middleware/validation.middleware');
const { verifyToken, isDonor } = require('../middleware/auth.middleware');

// Protected
router.post('/register', verifyToken, isDonor, registerDonorValidator, validateResults, registerDonor);
router.get('/me', verifyToken, getDonorMe);
router.get('/', verifyToken, getDonors);
router.get('/:id', verifyToken, getDonorById);
router.put('/:id', verifyToken, updateDonor);
router.delete('/:id', verifyToken, deleteDonor);

module.exports = router;
