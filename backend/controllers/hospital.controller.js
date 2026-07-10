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

/**
 * Get single hospital by ID
 */
const getHospitalById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('user');
    if (!hospital) {
      return sendError(res, 'Hospital profile not found', 404);
    }
    return sendSuccess(res, hospital, 'Hospital retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Get own hospital profile
 */
const getHospitalMe = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id }).populate('user');
    if (!hospital) {
      return sendError(res, 'Hospital profile not found for this user', 404);
    }
    return sendSuccess(res, hospital, 'Own hospital profile retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Update hospital profile
 */
const updateHospital = async (req, res, next) => {
  try {
    let hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return sendError(res, 'Hospital profile not found', 404);
    }

    // Owner check: Admin can update any, hospital user can only update their own
    if (req.user.role !== 'admin' && hospital.user.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized to update this hospital profile', 403);
    }

    const updates = req.body;

    if (updates.latitude && updates.longitude) {
      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(updates.longitude), parseFloat(updates.latitude)]
      };
    }

    hospital = await Hospital.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, hospital, 'Hospital profile updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete/deactivate hospital profile
 */
const deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return sendError(res, 'Hospital profile not found', 404);
    }

    // Owner check: Admin can delete/deactivate any, user can only do their own
    if (req.user.role !== 'admin' && hospital.user.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized to delete this hospital profile', 403);
    }

    // For compliance and history preservation, we soft delete (set isActive: false)
    hospital.isActive = false;
    await hospital.save();

    return sendSuccess(res, {}, 'Hospital profile deactivated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerHospital,
  getHospitals,
  getHospitalById,
  getHospitalMe,
  updateHospital,
  deleteHospital,
};
