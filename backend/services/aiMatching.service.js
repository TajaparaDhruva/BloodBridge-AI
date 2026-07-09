/**
 * BloodBridge AI - Donor Matching Service
 *
 * This service ranks eligible donors using a weighted scoring algorithm.
 * The architecture is designed so a real ML model can replace the scoring
 * function without changing the surrounding interface.
 */

const Donor = require('../models/Donor');
const { haversineDistance, isDonorEligible, getCompatibleDonorGroups } = require('../utils/helpers');
const logger = require('../utils/logger');

// ─── Scoring Weights ─────────────────────────────────────────────────────────
const WEIGHTS = {
  BLOOD_EXACT_MATCH: 40,   // exact blood group match bonus
  BLOOD_COMPAT_MATCH: 20,  // compatible (but not exact) group bonus
  DISTANCE: 25,            // proximity bonus (max at 0km)
  ELIGIBILITY: 15,         // days since last donation bonus
  RESPONSE_RATE: 10,       // historical acceptance rate bonus
  AVAILABILITY: 10,        // currently marked available
  RATING: 5,               // donor rating bonus
};

const MAX_SEARCH_RADIUS_KM = 50;

/**
 * Score a single donor against a blood request
 * @param {Object} donor - Donor document
 * @param {Object} request - { bloodGroup, location: { coordinates: [lng, lat] }, units }
 * @returns {number} Score 0-100
 */
const scoreDonor = (donor, request) => {
  let score = 0;

  // 1. Blood group scoring
  if (donor.bloodGroup === request.bloodGroup) {
    score += WEIGHTS.BLOOD_EXACT_MATCH;
  } else {
    const compatible = getCompatibleDonorGroups(request.bloodGroup);
    if (compatible.includes(donor.bloodGroup)) {
      score += WEIGHTS.BLOOD_COMPAT_MATCH;
    } else {
      return 0; // Incompatible — disqualify immediately
    }
  }

  // 2. Distance scoring (closer = higher score)
  const [reqLng, reqLat] = request.location.coordinates;
  const [donorLng, donorLat] = donor.location.coordinates;
  if (reqLng !== 0 && reqLat !== 0 && donorLng !== 0 && donorLat !== 0) {
    const distKm = haversineDistance(
      { lat: reqLat, lng: reqLng },
      { lat: donorLat, lng: donorLng }
    );
    const distScore = Math.max(0, 1 - distKm / MAX_SEARCH_RADIUS_KM);
    score += distScore * WEIGHTS.DISTANCE;
  } else {
    // No coordinates available — give partial distance credit
    score += WEIGHTS.DISTANCE * 0.5;
  }

  // 3. Eligibility (days since last donation)
  if (!donor.lastDonationDate) {
    score += WEIGHTS.ELIGIBILITY; // Never donated — fully eligible
  } else {
    const daysSince = Math.floor(
      (Date.now() - new Date(donor.lastDonationDate)) / (1000 * 60 * 60 * 24)
    );
    if (daysSince >= 180) score += WEIGHTS.ELIGIBILITY;
    else if (daysSince >= 90) score += WEIGHTS.ELIGIBILITY * 0.8;
    else score += 0; // Within safety window
  }

  // 4. Historical response rate
  const responseBonus = ((donor.responseRate || 100) / 100) * WEIGHTS.RESPONSE_RATE;
  score += responseBonus;

  // 5. Availability flag
  if (donor.isAvailable) score += WEIGHTS.AVAILABILITY;

  // 6. Donor rating
  const ratingBonus = ((donor.rating || 5) / 5) * WEIGHTS.RATING;
  score += ratingBonus;

  return Math.round(score * 10) / 10; // round to 1 decimal
};

/**
 * Find and rank the best donors for a blood request
 * @param {Object} request - BloodRequest document
 * @param {Object} options
 * @param {number} options.topN - Max donors to return (default: 10)
 * @param {number} options.radiusKm - Search radius in km (default: 20)
 * @returns {Promise<Array>} Ranked donor matches with scores
 */
const findBestMatches = async (request, options = {}) => {
  const { topN = 10, radiusKm = MAX_SEARCH_RADIUS_KM } = options;
  const startTime = Date.now();

  try {
    const compatibleGroups = getCompatibleDonorGroups(request.bloodGroup);
    const [reqLng, reqLat] = request.location?.coordinates || [0, 0];

    // Build geospatial query if coordinates available, otherwise fall back to city match
    let donorQuery = {
      bloodGroup: { $in: compatibleGroups },
      isEligible: true,
      isAvailable: true,
    };

    let donors;

    if (reqLng !== 0 && reqLat !== 0) {
      donorQuery.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [reqLng, reqLat] },
          $maxDistance: radiusKm * 1000, // metres
        },
      };
      donors = await Donor.find(donorQuery).limit(100).lean();
    } else {
      // Fallback: city-based matching
      donorQuery.city = new RegExp(request.city, 'i');
      donors = await Donor.find(donorQuery).limit(100).lean();
    }

    // Score and filter donors
    const scored = donors
      .filter((d) => isDonorEligible(d))
      .map((d) => ({ donor: d, score: scoreDonor(d, request) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    const elapsed = Date.now() - startTime;
    logger.info(
      `AI Match: ${scored.length} donors found for ${request.bloodGroup} in ${request.city} [${elapsed}ms]`
    );

    return {
      matches: scored,
      meta: {
        totalScanned: donors.length,
        matched: scored.length,
        matchTimeMs: elapsed,
        bloodGroup: request.bloodGroup,
        city: request.city,
      },
    };
  } catch (err) {
    logger.error(`AI Matching error: ${err.message}`);
    throw err;
  }
};

module.exports = { findBestMatches, scoreDonor };
