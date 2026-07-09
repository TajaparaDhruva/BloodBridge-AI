const { findBestMatches } = require('../services/aiMatching.service');
const BloodRequest = require('../models/BloodRequest');
const { sendSuccess, sendError } = require('../utils/helpers');

/**
 * Perform manual AI match computation for a request
 */
const matchDonors = async (req, res, next) => {
  try {
    const { requestId, bloodGroup, city, latitude, longitude, topN = 10, radiusKm = 20 } = req.body;

    let requestData;

    // Resolve request by ID or mock request from body parameters
    if (requestId) {
      requestData = await BloodRequest.findById(requestId);
      if (!requestData) {
        return sendError(res, 'Blood request not found', 404);
      }
    } else {
      if (!bloodGroup || !city) {
        return sendError(res, 'Blood group and city are required for custom simulation', 400);
      }
      const coordinates = latitude && longitude ? [parseFloat(longitude), parseFloat(latitude)] : [0, 0];
      requestData = {
        bloodGroup,
        city,
        location: { type: 'Point', coordinates }
      };
    }

    const matchingOptions = {
      topN: parseInt(topN),
      radiusKm: parseFloat(radiusKm)
    };

    const results = await findBestMatches(requestData, matchingOptions);
    return sendSuccess(res, results, 'AI donor matching query executed successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  matchDonors
};
