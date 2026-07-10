const User = require('../models/User');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const BloodRequest = require('../models/BloodRequest');
const { sendSuccess, sendError, paginate } = require('../utils/helpers');

/**
 * GET /api/admin/users
 * List all users with pagination and optional role filter
 */
const listUsers = async (req, res, next) => {
  try {
    const { role, isActive, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const result = await paginate(User, query, parseInt(page), parseInt(limit));
    return sendSuccess(res, result, 'Users retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/users/:id
 * Get a single user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, user, 'User retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/users/:id/deactivate
 * Deactivate (soft-delete) a user account
 */
const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    if (user.role === 'admin') return sendError(res, 'Cannot deactivate an admin account', 403);

    user.isActive = false;
    await user.save();
    return sendSuccess(res, { id: user._id }, 'User deactivated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/users/:id/activate
 * Re-activate a previously deactivated user
 */
const activateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);

    user.isActive = true;
    await user.save();
    return sendSuccess(res, { id: user._id }, 'User activated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/hospitals/:id/verify
 * Mark a hospital as verified
 */
const verifyHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return sendError(res, 'Hospital not found', 404);

    hospital.isVerified = true;
    await hospital.save();
    return sendSuccess(res, hospital, 'Hospital verified successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/donors/:id/verify
 * Mark a donor as verified
 */
const verifyDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return sendError(res, 'Donor not found', 404);

    donor.isVerified = true;
    await donor.save();
    return sendSuccess(res, donor, 'Donor verified successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/overview
 * High-level platform overview stats for admin dashboard
 */
const getOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalDonors,
      verifiedDonors,
      totalHospitals,
      verifiedHospitals,
      totalRequests,
      pendingRequests,
      fulfilledRequests,
    ] = await Promise.all([
      User.countDocuments(),
      Donor.countDocuments(),
      Donor.countDocuments({ isVerified: true }),
      Hospital.countDocuments(),
      Hospital.countDocuments({ isVerified: true }),
      BloodRequest.countDocuments(),
      BloodRequest.countDocuments({ status: 'pending' }),
      BloodRequest.countDocuments({ status: 'fulfilled' }),
    ]);

    // Requests by blood group
    const requestsByGroup = await BloodRequest.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return sendSuccess(res, {
      users: { total: totalUsers },
      donors: { total: totalDonors, verified: verifiedDonors, unverified: totalDonors - verifiedDonors },
      hospitals: { total: totalHospitals, verified: verifiedHospitals, unverified: totalHospitals - verifiedHospitals },
      requests: {
        total: totalRequests,
        pending: pendingRequests,
        fulfilled: fulfilledRequests,
        fulfillmentRate: totalRequests > 0 ? Math.round((fulfilledRequests / totalRequests) * 100) : 0,
      },
      requestsByBloodGroup: requestsByGroup,
    }, 'Admin overview retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUsers,
  getUserById,
  deactivateUser,
  activateUser,
  verifyHospital,
  verifyDonor,
  getOverview,
};
