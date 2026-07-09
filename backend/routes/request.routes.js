const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/request.controller');
const { createRequestValidator } = require('../validators/request.validator');
const validateResults = require('../middleware/validation.middleware');
const { verifyToken, isHospital } = require('../middleware/auth.middleware');

// Protected
router.post('/', verifyToken, isHospital, createRequestValidator, validateResults, createRequest);
router.get('/', verifyToken, getRequests);
router.put('/:id', verifyToken, updateRequestStatus);

module.exports = router;
