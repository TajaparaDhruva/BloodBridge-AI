const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { sendSuccess, sendError } = require('../utils/helpers');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return sendError(res, 'An account with this email already exists. Please log in instead.', 400);
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
    const normalizedEmail = (email || '').toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 'Invalid email or password. Please check your credentials.', 401);
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

/**
 * Update current profile (both User and Profile models)
 */
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      avatar,
      bio,
      dateOfBirth,
      address,
      city,
      state,
      pincode,
      emergencyContact,
      preferences,
      socialLinks
    } = req.body;

    // Update user name if provided
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name }, { runValidators: true });
    }

    // Update profile
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    if (avatar !== undefined) profile.avatar = avatar;
    if (bio !== undefined) profile.bio = bio;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (address !== undefined) profile.address = address;
    if (city !== undefined) profile.city = city;
    if (state !== undefined) profile.state = state;
    if (pincode !== undefined) profile.pincode = pincode;
    if (emergencyContact !== undefined) profile.emergencyContact = emergencyContact;
    if (preferences !== undefined) profile.preferences = { ...profile.preferences, ...preferences };
    if (socialLinks !== undefined) profile.socialLinks = { ...profile.socialLinks, ...socialLinks };

    await profile.save();
    
    const updatedProfile = await Profile.findOne({ user: req.user._id }).populate('user');

    return sendSuccess(res, updatedProfile, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Change secure password
 */
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return sendError(res, 'Both old and new passwords are required', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.comparePassword(oldPassword))) {
      return sendError(res, 'Invalid current password', 400);
    }

    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters long', 400);
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, {}, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Log in / Sign up with Google
 */
const googleAuth = async (req, res, next) => {
  try {
    const { token, role = 'donor' } = req.body;
    
    if (!token) {
      return sendError(res, 'Google token is required', 400);
    }

    client.setCredentials({ access_token: token });
    const userInfoResponse = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });
    const payload = userInfoResponse.data;
    
    const email = payload.email.toLowerCase().trim();
    const name = payload.name;
    const picture = payload.picture;

    let user = await User.findOne({ email });

    if (!user) {
      // Create User
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // random secure password
        role,
      });

      // Initialize Profile
      await Profile.create({ user: user._id, avatar: picture });

      // Create Donor/Hospital
      if (role === 'donor') {
        await Donor.create({
          user: user._id,
          name: name,
          bloodGroup: 'O+',
          age: 25,
          weight: 65,
          gender: 'unknown',
          contact: '0000000000',
          city: 'Unknown',
          state: 'Unknown',
          isEligible: true,
          isAvailable: true,
          isVerified: false,
          location: {
            type: 'Point',
            coordinates: [72.8777, 19.0760] // Default
          }
        });
      } else if (role === 'hospital') {
         await Hospital.create({
          user: user._id,
          name: name,
          registrationNumber: `HOSP-${Date.now()}`,
          type: 'private',
          contact: '0000000000',
          email: email,
          address: 'Unknown',
          city: 'Unknown',
          state: 'Unknown',
          pincode: '000000',
          location: {
            type: 'Point',
            coordinates: [72.8777, 19.0760] // Default
          },
          isVerified: false,
          isActive: true,
          emergencyContact: '0000000000',
          bedsCapacity: 100,
          hasBloodBank: true
        });
      }
    } else {
      if (!user.isActive) {
        return sendError(res, 'Account is deactivated', 403);
      }
      user.lastLogin = new Date();
      await user.save();
    }

    const jwtToken = signToken(user._id);

    const isProdLogin = process.env.NODE_ENV === 'production';
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: isProdLogin,
      sameSite: isProdLogin ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userObj = user.toJSON();

    return sendSuccess(res, { user: userObj, token: jwtToken }, 'Google Authentication successful');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  googleAuth,
};
