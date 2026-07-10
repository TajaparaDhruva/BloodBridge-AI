const BloodRequest = require('../models/BloodRequest');
const Hospital = require('../models/Hospital');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendSuccess, sendError, paginate } = require('../utils/helpers');
const { findBestMatches } = require('../services/aiMatching.service');
const logger = require('../utils/logger');

/**
 * Create a new blood request (hospital only)
 */
const createRequest = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) {
      return sendError(res, 'No hospital profile linked to your user account', 400);
    }

    const {
      patientName,
      bloodGroup,
      units,
      urgency,
      city,
      state,
      latitude,
      longitude,
      notes,
    } = req.body;

    const coordinates = latitude && longitude ? [parseFloat(longitude), parseFloat(latitude)] : hospital.location.coordinates;

    const request = await BloodRequest.create({
      hospital: hospital._id,
      requestedBy: req.user._id,
      patientName,
      bloodGroup,
      units,
      urgency: urgency || 'emergency',
      city: city || hospital.city,
      state: state || hospital.state,
      location: {
        type: 'Point',
        coordinates,
      },
      notes,
    });

    // Auto-trigger matching to populate notifications
    try {
      const matchResult = await findBestMatches(request, { topN: 5 });
      if (matchResult && matchResult.matches.length > 0) {
        request.status = 'matching';
        request.matchedDonors = matchResult.matches.map(m => ({
          donor: m.donor._id,
          score: m.score,
          status: 'notified'
        }));
        await request.save();

        // Send notifications
        const notificationPromises = matchResult.matches.map(async (m) => {
          return Notification.create({
            recipient: m.donor.user,
            type: 'match_found',
            title: `🩸 Critical Match Required - ${request.bloodGroup}`,
            message: `Emergency request for ${request.units} units of ${request.bloodGroup} at ${hospital.name}. Distance: ${m.score}% match relevance.`,
            data: { requestId: request._id, score: m.score }
          });
        });
        await Promise.all(notificationPromises);
      }
    } catch (matchErr) {
      logger.error(`Automated match trigger failed: ${matchErr.message}`);
    }

    return sendSuccess(res, request, 'Blood request submitted successfully', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Get blood requests with filtering
 */
const getRequests = async (req, res, next) => {
  try {
    const { bloodGroup, urgency, status, city, hospitalId, page = 1, limit = 20 } = req.query;

    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (urgency) query.urgency = urgency;
    if (status) query.status = status;
    if (city) query.city = new RegExp(city, 'i');
    if (hospitalId) query.hospital = hospitalId;

    // If user is a Hospital user and not admin, restrict to their hospital requests by default
    if (req.user.role === 'hospital' && !hospitalId) {
      const hospital = await Hospital.findOne({ user: req.user._id });
      if (hospital) {
        query.hospital = hospital._id;
      }
    }

    const result = await paginate(BloodRequest, query, parseInt(page), parseInt(limit), [
      { path: 'hospital', select: 'name contact address city' },
      { path: 'requestedBy', select: 'name email' }
    ]);

    return sendSuccess(res, result, 'Requests retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update request status (fulfilled, cancelled, dispatched, etc.)
 */
const updateRequestStatus = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return sendError(res, 'Blood request not found', 404);
    }

    // Verify hospital owner or admin permissions
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (req.user.role !== 'admin' && (!hospital || request.hospital.toString() !== hospital._id.toString())) {
      return sendError(res, 'Unauthorized to update this request', 403);
    }

    const { status, notes } = req.body;
    if (status) request.status = status;
    if (notes) request.notes = notes;
    if (status === 'fulfilled') {
      request.fulfilledAt = new Date();
    }

    await request.save();
    return sendSuccess(res, request, 'Blood request updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Get single blood request by ID
 */
const getRequestById = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate({ path: 'hospital', select: 'name contact address city state pincode' })
      .populate({ path: 'requestedBy', select: 'name email' });
    
    if (!request) {
      return sendError(res, 'Blood request not found', 404);
    }
    return sendSuccess(res, request, 'Blood request retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a blood request
 */
const deleteRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return sendError(res, 'Blood request not found', 404);
    }

    // Verify hospital owner or admin permissions
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (req.user.role !== 'admin' && (!hospital || request.hospital.toString() !== hospital._id.toString())) {
      return sendError(res, 'Unauthorized to delete this request', 403);
    }

    await BloodRequest.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, 'Blood request deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus,
  getRequestById,
  deleteRequest,
};
