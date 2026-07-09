/**
 * Standard API response helper
 */
const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  res.status(statusCode).json(payload);
};

/**
 * Calculate Haversine distance between two lat/lng points (km)
 */
const haversineDistance = (coord1, coord2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // Earth radius km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Check if a donor is medically eligible to donate
 */
const isDonorEligible = (donor) => {
  if (!donor.isAvailable) return false;
  if (!donor.isEligible) return false;
  if (!donor.lastDonationDate) return true;
  const daysSince = Math.floor(
    (Date.now() - new Date(donor.lastDonationDate)) / (1000 * 60 * 60 * 24)
  );
  return daysSince >= 90;
};

/**
 * Get compatible blood groups for a requested blood type
 * Returns donor blood groups that can donate to this recipient
 */
const getCompatibleDonorGroups = (recipientGroup) => {
  const compatibility = {
    'A+':  ['A+', 'A-', 'O+', 'O-'],
    'A-':  ['A-', 'O-'],
    'B+':  ['B+', 'B-', 'O+', 'O-'],
    'B-':  ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+':  ['O+', 'O-'],
    'O-':  ['O-'],
  };
  return compatibility[recipientGroup] || [recipientGroup];
};

/**
 * Paginate mongoose query result
 */
const paginate = async (model, query, page = 1, limit = 20, populate = '') => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    model.find(query).skip(skip).limit(limit).populate(populate),
    model.countDocuments(query),
  ]);
  return { data, total, page, pages: Math.ceil(total / limit) };
};

module.exports = {
  sendSuccess,
  sendError,
  haversineDistance,
  isDonorEligible,
  getCompatibleDonorGroups,
  paginate,
};
