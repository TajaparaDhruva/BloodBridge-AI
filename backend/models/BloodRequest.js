const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    units: { type: Number, required: true, min: 1, max: 20 },
    urgency: {
      type: String,
      enum: ['emergency', 'urgent', 'normal'],
      default: 'emergency',
    },
    status: {
      type: String,
      enum: ['pending', 'matching', 'dispatched', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
    city: { type: String, required: true },
    state: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    matchedDonors: [
      {
        donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
        score: { type: Number },
        status: {
          type: String,
          enum: ['notified', 'accepted', 'declined', 'dispatched'],
          default: 'notified',
        },
        notifiedAt: { type: Date, default: Date.now },
        respondedAt: { type: Date },
      },
    ],
    matchTime: { type: Number }, // seconds taken to find match
    fulfilledAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

bloodRequestSchema.index({ location: '2dsphere' });
bloodRequestSchema.index({ status: 1, urgency: 1 });
bloodRequestSchema.index({ bloodGroup: 1, city: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
