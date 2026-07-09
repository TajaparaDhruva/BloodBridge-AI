const { body } = require('express-validator');

const registerHospitalValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Hospital name is required')
    .isLength({ max: 150 }).withMessage('Hospital name cannot exceed 150 characters'),
  body('registrationNumber')
    .trim()
    .notEmpty().withMessage('Registration number is required'),
  body('type')
    .optional()
    .isIn(['government', 'private', 'ngo', 'clinic', 'blood_bank']).withMessage('Invalid hospital type'),
  body('contact')
    .trim()
    .notEmpty().withMessage('Contact number is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .isLength({ min: 4, max: 10 }).withMessage('Invalid pincode length'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('bedsCapacity')
    .optional()
    .isInt({ min: 0 }).withMessage('Beds capacity must be a positive integer'),
  body('hasBloodBank')
    .optional()
    .isBoolean().withMessage('hasBloodBank must be a boolean')
];

module.exports = {
  registerHospitalValidator
};
