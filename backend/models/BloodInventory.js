const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    units: { type: Number, required: true, min: 0, default: 0 },
    safetyThreshold: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ['stable', 'warning', 'critical'],
      default: 'stable',
    },
    lastUpdated: { type: Date, default: Date.now },
    expiryAlert: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-calculate status before save
bloodInventorySchema.pre('save', function (next) {
  if (this.units <= 0) this.status = 'critical';
  else if (this.units < this.safetyThreshold) this.status = 'warning';
  else this.status = 'stable';
  this.lastUpdated = new Date();
  next();
});

bloodInventorySchema.index({ hospital: 1, bloodGroup: 1 }, { unique: true });

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);
