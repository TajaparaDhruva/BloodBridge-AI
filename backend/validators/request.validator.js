const { body } = require('express-validator');

const createRequestValidator = [
  body('patientName')
    .trim()
    .notEmpty().withMessage('Patient name is required'),
  body('bloodGroup')
    .trim()
    .notEmpty().withMessage('Blood group is required')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
  body('units')
    .notEmpty().withMessage('Number of units is required')
    .isInt({ min: 1, max: 20 }).withMessage('Units must be between 1 and 20'),
  body('urgency')
    .optional()
    .isIn(['emergency', 'urgent', 'normal']).withMessage('Invalid urgency level'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('state')
    .optional()
    .trim(),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

module.exports = {
  createRequestValidator
};
