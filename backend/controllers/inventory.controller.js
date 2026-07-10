const BloodInventory = require('../models/BloodInventory');
const Hospital = require('../models/Hospital');
const { sendSuccess, sendError } = require('../utils/helpers');

/**
 * GET /api/inventory/
 * Get inventory for the authenticated hospital (or all if admin)
 * Query: ?hospitalId=<id> (admin only), ?bloodGroup=A+
 */
const getInventory = async (req, res, next) => {
  try {
    const { bloodGroup, hospitalId } = req.query;

    let query = {};

    if (req.user.role === 'admin' && hospitalId) {
      query.hospital = hospitalId;
    } else if (req.user.role === 'hospital') {
      const hospital = await Hospital.findOne({ user: req.user._id });
      if (!hospital) {
        return sendError(res, 'No hospital profile linked to your account', 404);
      }
      query.hospital = hospital._id;
    } else if (req.user.role === 'admin') {
      // Admin with no filter — return all
    } else {
      return sendError(res, 'Access restricted', 403);
    }

    if (bloodGroup) query.bloodGroup = bloodGroup;

    const inventory = await BloodInventory.find(query)
      .populate('hospital', 'name city state')
      .sort({ bloodGroup: 1 });

    return sendSuccess(res, inventory, 'Inventory retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/inventory/
 * Upsert a blood group stock entry for the hospital
 * Body: { bloodGroup, units, safetyThreshold }
 */
const upsertInventory = async (req, res, next) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) {
      return sendError(res, 'No hospital profile linked to your account', 404);
    }

    const { bloodGroup, units, safetyThreshold } = req.body;

    // Upsert: update if exists, create otherwise
    const inventory = await BloodInventory.findOneAndUpdate(
      { hospital: hospital._id, bloodGroup },
      {
        $set: {
          units: Math.max(0, Number(units)),
          ...(safetyThreshold !== undefined && { safetyThreshold: Number(safetyThreshold) }),
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return sendSuccess(res, inventory, 'Inventory updated successfully', 200);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/inventory/:id
 * Update a specific inventory record's units
 * Body: { units, safetyThreshold }
 */
const updateInventory = async (req, res, next) => {
  try {
    const inventory = await BloodInventory.findById(req.params.id).populate('hospital');
    if (!inventory) {
      return sendError(res, 'Inventory record not found', 404);
    }

    // Ownership check
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (req.user.role !== 'admin' && (!hospital || inventory.hospital._id.toString() !== hospital._id.toString())) {
      return sendError(res, 'Unauthorized to update this inventory', 403);
    }

    const { units, safetyThreshold } = req.body;
    if (units !== undefined) inventory.units = Math.max(0, Number(units));
    if (safetyThreshold !== undefined) inventory.safetyThreshold = Number(safetyThreshold);

    await inventory.save();
    return sendSuccess(res, inventory, 'Inventory record updated');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/inventory/:id
 * Remove an inventory record (admin only)
 */
const deleteInventory = async (req, res, next) => {
  try {
    const inventory = await BloodInventory.findById(req.params.id);
    if (!inventory) {
      return sendError(res, 'Inventory record not found', 404);
    }
    await BloodInventory.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, 'Inventory record deleted');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/inventory/summary
 * Aggregated stock summary across all hospitals (admin) or own hospital
 */
const getInventorySummary = async (req, res, next) => {
  try {
    let matchStage = {};

    if (req.user.role === 'hospital') {
      const hospital = await Hospital.findOne({ user: req.user._id });
      if (!hospital) return sendError(res, 'No hospital profile found', 404);
      matchStage = { hospital: hospital._id };
    }

    const summary = await BloodInventory.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$bloodGroup',
          totalUnits: { $sum: '$units' },
          criticalCount: { $sum: { $cond: [{ $eq: ['$status', 'critical'] }, 1, 0] } },
          warningCount: { $sum: { $cond: [{ $eq: ['$status', 'warning'] }, 1, 0] } },
          stableCount: { $sum: { $cond: [{ $eq: ['$status', 'stable'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return sendSuccess(res, summary, 'Inventory summary retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getInventory,
  upsertInventory,
  updateInventory,
  deleteInventory,
  getInventorySummary,
};
