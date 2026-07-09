const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    totalRequests: { type: Number, default: 0 },
    fulfilledRequests: { type: Number, default: 0 },
    matchRate: { type: Number, default: 0 }, // percentage
    avgMatchTimeSeconds: { type: Number, default: 0 },
    newDonors: { type: Number, default: 0 },
    activeHospitals: { type: Number, default: 0 },
    criticalAlerts: { type: Number, default: 0 },
    bloodGroupBreakdown: {
      'A+': { type: Number, default: 0 },
      'A-': { type: Number, default: 0 },
      'B+': { type: Number, default: 0 },
      'B-': { type: Number, default: 0 },
      'AB+': { type: Number, default: 0 },
      'AB-': { type: Number, default: 0 },
      'O+': { type: Number, default: 0 },
      'O-': { type: Number, default: 0 },
    },
    cityBreakdown: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

analyticsSchema.index({ date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
