const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { sendSuccess, sendError } = require('../utils/helpers');

// Helper to sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Register a user
 */
const signup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      city,
      bloodGroup,
      gender,
      age,
      weight,
      lastDonation,
      hospitalName,
      license,
      coordinator,
      address,
      capacity,
      emergencyReady
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'Email already in use', 400);
    }

    const user = await User.create({ name, email, password, role });

    try {
      // Initialize an empty profile for this user
      await Profile.create({ user: user._id });

      // Create Donor or Hospital document depending on the role
      if (role === 'donor') {
        const cityToState = {
          'mumbai': 'Maharashtra',
          'pune': 'Maharashtra',
          'ahmedabad': 'Gujarat',
          'surat': 'Gujarat',
          'delhi': 'Delhi',
          'bangalore': 'Karnataka',
          'hyderabad': 'Telangana',
          'chennai': 'Tamil Nadu',
          'kolkata': 'West Bengal',
          'jaipur': 'Rajasthan'
        };
        const normalizedCity = (city || 'Mumbai').trim().toLowerCase();
        const state = cityToState[normalizedCity] || 'Maharashtra';

        await Donor.create({
          user: user._id,
          name: name || 'Anonymous Donor',
          bloodGroup: bloodGroup || 'O+',
          age: age ? Number(age) : 25,
          weight: weight ? Number(weight) : 65,
          gender: (gender || 'male').toLowerCase(),
          contact: phone || '0000000000',
          city: city || 'Mumbai',
          state: state,
          lastDonationDate: lastDonation ? new Date(lastDonation) : null,
          isEligible: true,
          isAvailable: true,
          isVerified: false,
          location: {
            type: 'Point',
            coordinates: [72.8777, 19.0760] // Default Mumbai coordinates [lng, lat]
          }
        });
      } else if (role === 'hospital') {
        const cityToState = {
          'mumbai': 'Maharashtra',
          'pune': 'Maharashtra',
          'ahmedabad': 'Gujarat',
          'surat': 'Gujarat',
          'delhi': 'Delhi',
          'bangalore': 'Karnataka',
          'hyderabad': 'Telangana',
          'chennai': 'Tamil Nadu',
          'kolkata': 'West Bengal',
          'jaipur': 'Rajasthan'
        };
        const normalizedCity = (city || 'Mumbai').trim().toLowerCase();
        const state = cityToState[normalizedCity] || 'Maharashtra';

        await Hospital.create({
          user: user._id,
          name: hospitalName || name || 'General Hospital',
          registrationNumber: license || `HOSP-${Date.now()}`,
          type: 'private',
          contact: phone || '0000000000',
          email: email,
          address: address || '123 Hospital Street',
          city: city || 'Mumbai',
          state: state,
          pincode: '400001', // Default pincode
          location: {
            type: 'Point',
            coordinates: [72.8777, 19.0760] // Default Mumbai coordinates [lng, lat]
          },
          isVerified: true,
          isActive: true,
          emergencyContact: phone || '0000000000',
          bedsCapacity: capacity ? Number(capacity) : 100,
          hasBloodBank: true
        });
      }
    } catch (creationError) {
      // Rollback: delete the created user if subsequent profile/donor/hospital creation fails
      await User.findByIdAndDelete(user._id);
      throw creationError;
    }

    const token = signToken(user._id);

    // Set cookie — use sameSite: 'none' for cross-origin (Netlify → Render)
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendSuccess(res, { user, token }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Log in a user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Account is deactivated', 403);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id);

    // Set cookie — use sameSite: 'none' for cross-origin (Netlify → Render)
    const isProdLogin = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProdLogin,
      sameSite: isProdLogin ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userObj = user.toJSON();

    return sendSuccess(res, { user: userObj, token }, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Log out user
 */
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 5000),
  });
  return sendSuccess(res, {}, 'Logged out successfully');
};

/**
 * Get current profile
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user');
    if (!profile) {
      return sendError(res, 'Profile not found', 404);
    }
    return sendSuccess(res, profile, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getProfile,
};
