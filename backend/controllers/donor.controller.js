const Donor = require('../models/Donor');
const { sendSuccess, sendError, paginate } = require('../utils/helpers');

/**
 * Register a donor profile (tied to current authenticated user)
 */
const registerDonor = async (req, res, next) => {
  try {
    // Check if donor profile already exists for this user
    const existingDonor = await Donor.findOne({ user: req.user._id });
    if (existingDonor) {
      return sendError(res, 'You have already registered as a donor', 400);
    }

    const {
      bloodGroup,
      age,
      weight,
      gender,
      contact,
      city,
      state,
      latitude,
      longitude,
      lastDonationDate,
      medicalConditions,
    } = req.body;

    const coordinates = latitude && longitude ? [parseFloat(longitude), parseFloat(latitude)] : [0, 0];

    const donor = await Donor.create({
      user: req.user._id,
      name: req.user.name,
      bloodGroup,
      age,
      weight,
      gender,
      contact,
      city,
      state,
      location: {
        type: 'Point',
        coordinates,
      },
      lastDonationDate: lastDonationDate || null,
      medicalConditions: medicalConditions || [],
    });

    return sendSuccess(res, donor, 'Donor registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all donors with pagination & filter capabilities
 */
const getDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city, state, isAvailable, isEligible, page = 1, limit = 20 } = req.query;

    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
    if (isEligible !== undefined) query.isEligible = isEligible === 'true';

    const result = await paginate(Donor, query, parseInt(page), parseInt(limit), 'user');
    return sendSuccess(res, result, 'Donors retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get single donor profile by ID
 */
const getDonorById = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id).populate('user');
    if (!donor) {
      return sendError(res, 'Donor profile not found', 404);
    }
    return sendSuccess(res, donor, 'Donor retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Update donor profile details
 */
const updateDonor = async (req, res, next) => {
  try {
    let donor = await Donor.findById(req.params.id);
    if (!donor) {
      return sendError(res, 'Donor profile not found', 404);
    }

    // Auth check: Admin can update any, user can only update their own
    if (req.user.role !== 'admin' && donor.user.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized to update this donor profile', 403);
    }

    const updates = req.body;
    
    // Format location coordinates if matching lat/lng provided
    if (updates.latitude && updates.longitude) {
      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(updates.longitude), parseFloat(updates.latitude)]
      };
    }

    donor = await Donor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, donor, 'Donor profile updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete donor profile
 */
const deleteDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return sendError(res, 'Donor profile not found', 404);
    }

    // Guard
    if (req.user.role !== 'admin' && donor.user.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized to delete this donor profile', 403);
    }

    await Donor.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, 'Donor profile deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerDonor,
  getDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
};
