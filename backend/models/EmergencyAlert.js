const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      required: true,
    },
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
    units: { type: Number, required: true },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium'],
      default: 'critical',
    },
    broadcastRadius: { type: Number, default: 20 }, // km
    donorsNotified: { type: Number, default: 0 },
    donorsResponded: { type: Number, default: 0 },
    isResolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
    broadcastChannels: {
      type: [String],
      enum: ['push', 'sms', 'email'],
      default: ['push', 'sms'],
    },
  },
  { timestamps: true }
);

emergencyAlertSchema.index({ isResolved: 1, createdAt: -1 });

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);
