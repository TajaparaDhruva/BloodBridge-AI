const Hospital = require('../models/Hospital');
const { sendSuccess, sendError, paginate } = require('../utils/helpers');

/**
 * Register a Hospital profile (tied to current authenticated user)
 */
const registerHospital = async (req, res, next) => {
  try {
    // Check if hospital profile already exists for this user
    const existingHospital = await Hospital.findOne({ user: req.user._id });
    if (existingHospital) {
      return sendError(res, 'A hospital profile is already registered with this account', 400);
    }

    const {
      name,
      registrationNumber,
      type,
      contact,
      email,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      bedsCapacity,
      hasBloodBank,
    } = req.body;

    // Check unique registration code
    const duplicateReg = await Hospital.findOne({ registrationNumber });
    if (duplicateReg) {
      return sendError(res, 'Registration number is already registered', 400);
    }

    const coordinates = latitude && longitude ? [parseFloat(longitude), parseFloat(latitude)] : [0, 0];

    const hospital = await Hospital.create({
      user: req.user._id,
      name,
      registrationNumber,
      type: type || 'private',
      contact,
      email: email || req.user.email,
      address,
      city,
      state,
      pincode,
      location: {
        type: 'Point',
        coordinates,
      },
      bedsCapacity: bedsCapacity || 0,
      hasBloodBank: hasBloodBank || false,
    });

    return sendSuccess(res, hospital, 'Hospital registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all hospitals with pagination & search
 */
const getHospitals = async (req, res, next) => {
  try {
    const { city, state, pincode, type, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    if (pincode) query.pincode = pincode;
    if (type) query.type = type;

    const result = await paginate(Hospital, query, parseInt(page), parseInt(limit), 'user');
    return sendSuccess(res, result, 'Hospitals retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerHospital,
  getHospitals,
};
