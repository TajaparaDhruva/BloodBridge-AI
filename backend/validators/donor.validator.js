const { body } = require('express-validator');

const registerDonorValidator = [
  body('bloodGroup')
    .trim()
    .notEmpty().withMessage('Blood group is required')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 18, max: 65 }).withMessage('Donor must be between 18 and 65 years old'),
  body('weight')
    .notEmpty().withMessage('Weight is required')
    .isFloat({ min: 45 }).withMessage('Donor must weigh at least 45 kg'),
  body('gender')
    .trim()
    .notEmpty().withMessage('Gender is required')
    .isIn(['male', 'female', 'other']).withMessage('Invalid gender value'),
  body('contact')
    .trim()
    .notEmpty().withMessage('Contact details are required')
    .isLength({ min: 8, max: 15 }).withMessage('Contact number must be between 8 and 15 digits'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('lastDonationDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Last donation date must be a valid date format')
];

module.exports = {
  registerDonorValidator
};
