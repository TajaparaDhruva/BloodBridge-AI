const mongoose = require('mongoose');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const donorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: BLOOD_GROUPS,
    },
    age: {
      type: Number,
      required: true,
      min: [18, 'Minimum age is 18'],
      max: [65, 'Maximum age is 65'],
    },
    weight: {
      type: Number,
      required: true,
      min: [45, 'Minimum weight is 45 kg'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    contact: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    lastDonationDate: { type: Date, default: null },
    isEligible: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    medicalConditions: [{ type: String }],
    donationCount: { type: Number, default: 0 },
    responseRate: { type: Number, default: 100 }, // percentage
    rating: { type: Number, default: 5, min: 1, max: 5 },
    aiScore: { type: Number, default: 90 },
    avatarChar: { type: String, default: 'A' },
  },
  { timestamps: true }
);

// Geospatial index for location-based queries
donorSchema.index({ location: '2dsphere' });
donorSchema.index({ bloodGroup: 1, city: 1 });

// Virtual: eligibility check based on last donation
donorSchema.virtual('canDonateNow').get(function () {
  if (!this.lastDonationDate) return true;
  const daysSince = Math.floor(
    (Date.now() - new Date(this.lastDonationDate)) / (1000 * 60 * 60 * 24)
  );
  return daysSince >= 90;
});

module.exports = mongoose.model('Donor', donorSchema);
