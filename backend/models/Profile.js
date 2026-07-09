const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    avatar: { type: String, default: null },
    bio: { type: String, maxlength: 500 },
    dateOfBirth: { type: Date },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String },
    },
    preferences: {
      language: { type: String, default: 'en' },
      notifications: { type: Boolean, default: true },
      emailAlerts: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: true },
    },
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
