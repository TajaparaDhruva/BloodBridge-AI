const express = require('express');
const router = express.Router();
const {
  getInventory,
  upsertInventory,
  updateInventory,
  deleteInventory,
  getInventorySummary,
} = require('../controllers/inventory.controller');
const { body } = require('express-validator');
const validateResults = require('../middleware/validation.middleware');
const { verifyToken, isHospital, isHospitalOrAdmin, isAdmin } = require('../middleware/auth.middleware');

const inventoryValidator = [
  body('bloodGroup')
    .notEmpty().withMessage('Blood group is required')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
  body('units')
    .notEmpty().withMessage('Units is required')
    .isNumeric().withMessage('Units must be a number')
    .custom(v => Number(v) >= 0).withMessage('Units cannot be negative'),
];

const updateValidator = [
  body('units')
    .optional()
    .isNumeric().withMessage('Units must be a number')
    .custom(v => Number(v) >= 0).withMessage('Units cannot be negative'),
  body('safetyThreshold')
    .optional()
    .isNumeric().withMessage('Safety threshold must be a number'),
];

// GET /api/inventory/summary — must come before /:id to avoid param collision
router.get('/summary', verifyToken, isHospitalOrAdmin, getInventorySummary);

// GET /api/inventory/
router.get('/', verifyToken, isHospitalOrAdmin, getInventory);

// POST /api/inventory/ — upsert stock for own hospital
router.post('/', verifyToken, isHospital, inventoryValidator, validateResults, upsertInventory);

// PUT /api/inventory/:id — update specific record
router.put('/:id', verifyToken, isHospitalOrAdmin, updateValidator, validateResults, updateInventory);

// DELETE /api/inventory/:id — admin only
router.delete('/:id', verifyToken, isAdmin, deleteInventory);

module.exports = router;
