const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ['government', 'private', 'ngo', 'clinic', 'blood_bank'],
      default: 'private',
    },
    contact: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    emergencyContact: { type: String },
    bedsCapacity: { type: Number, default: 0 },
    hasBloodBank: { type: Boolean, default: false },
  },
  { timestamps: true }
);

hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ city: 1, state: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
