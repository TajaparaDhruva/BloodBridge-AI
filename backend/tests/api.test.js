const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const BloodRequest = require('../models/BloodRequest');
const BloodInventory = require('../models/BloodInventory');
const Notification = require('../models/Notification');
const { JWT_SECRET } = require('../config/env');

// Mock all Mongoose models
jest.mock('../models/User');
jest.mock('../models/Profile');
jest.mock('../models/Donor');
jest.mock('../models/Hospital');
jest.mock('../models/BloodRequest');
jest.mock('../models/BloodInventory');
jest.mock('../models/Notification');

// Mock logger to keep test console clean
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('MERN Backend Completed API Surface Tests', () => {
  let donorToken;
  let hospitalToken;
  let adminToken;
  
  const mockDonorUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Donor',
    email: 'donor@test.com',
    role: 'donor',
    isActive: true,
  };

  const mockHospitalUser = {
    _id: '507f1f77bcf86cd799439012',
    name: 'Test Hospital',
    email: 'hospital@test.com',
    role: 'hospital',
    isActive: true,
  };

  const mockAdminUser = {
    _id: '507f1f77bcf86cd799439013',
    name: 'Test Admin',
    email: 'admin@test.com',
    role: 'admin',
    isActive: true,
  };

  beforeAll(() => {
    donorToken = jwt.sign({ id: mockDonorUser._id }, JWT_SECRET);
    hospitalToken = jwt.sign({ id: mockHospitalUser._id }, JWT_SECRET);
    adminToken = jwt.sign({ id: mockAdminUser._id }, JWT_SECRET);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Authentication and Profile Completion', () => {
    test('PUT /api/auth/profile - Update own profile successfully', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockDonorUser)
      });
      User.findByIdAndUpdate.mockResolvedValue(mockDonorUser);
      
      const mockProfile = {
        user: mockDonorUser._id,
        bio: 'New bio',
        save: jest.fn().mockResolvedValue(true)
      };
      
      const chainable = {
        populate: jest.fn().mockResolvedValue(mockProfile),
        then: (onFulfilled) => Promise.resolve(mockProfile).then(onFulfilled)
      };
      
      Profile.findOne.mockReturnValue(chainable);

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({ name: 'Updated Name', bio: 'New bio' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile updated successfully');
    });

    test('PUT /api/auth/change-password - Fail validation if short password', async () => {
      const response = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({ oldPassword: 'old', newPassword: '123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('2. Hospital CRUD API Extensions', () => {
    test('GET /api/hospital/me - Get own hospital profile', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockHospitalUser)
      });

      const mockHospital = {
        _id: '507f1f77bcf86cd799439021',
        user: mockHospitalUser._id,
        name: 'Metro Hospital'
      };
      
      Hospital.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockHospital)
      });

      const response = await request(app)
        .get('/api/hospital/me')
        .set('Authorization', `Bearer ${hospitalToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Metro Hospital');
    });

    test('PUT /api/hospital/:id - Fail if not owner or admin', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockDonorUser)
      });

      const mockHospital = {
        _id: '507f1f77bcf86cd799439021',
        user: mockHospitalUser._id,
        name: 'Metro Hospital'
      };
      Hospital.findById.mockResolvedValue(mockHospital);

      const response = await request(app)
        .put('/api/hospital/507f1f77bcf86cd799439021')
        .set('Authorization', `Bearer ${donorToken}`)
        .send({ name: 'New Hospital Name' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('3. Blood Request Extensions', () => {
    test('GET /api/request/:id - Retrieve request details', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockDonorUser)
      });

      const mockRequest = {
        _id: '507f1f77bcf86cd799439031',
        patientName: 'Jane Doe',
        bloodGroup: 'O-'
      };
      
      BloodRequest.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockRequest)
        })
      });

      const response = await request(app)
        .get('/api/request/507f1f77bcf86cd799439031')
        .set('Authorization', `Bearer ${donorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patientName).toBe('Jane Doe');
    });
  });

  describe('4. Notification Dismissal', () => {
    test('DELETE /api/notifications/:id - Dismiss notification', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockDonorUser)
      });

      const mockNotification = {
        _id: '507f1f77bcf86cd799439041',
        recipient: mockDonorUser._id,
        title: 'Alert'
      };
      Notification.findById.mockResolvedValue(mockNotification);
      Notification.findByIdAndDelete.mockResolvedValue({});

      const response = await request(app)
        .delete('/api/notifications/507f1f77bcf86cd799439041')
        .set('Authorization', `Bearer ${donorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('5. Inventory Management API', () => {
    test('POST /api/inventory - Upsert blood inventory successfully', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockHospitalUser)
      });

      const mockHospital = { _id: '507f1f77bcf86cd799439021', user: mockHospitalUser._id };
      Hospital.findOne.mockResolvedValue(mockHospital);
      BloodInventory.findOneAndUpdate.mockResolvedValue({
        hospital: mockHospital._id,
        bloodGroup: 'B+',
        units: 15
      });

      const response = await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${hospitalToken}`)
        .send({ bloodGroup: 'B+', units: 15 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('POST /api/inventory - Fail validation for negative units', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockHospitalUser)
      });

      const response = await request(app)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${hospitalToken}`)
        .send({ bloodGroup: 'B+', units: -5 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('6. Admin Platform Management', () => {
    test('GET /api/admin/overview - Access restricted to admins', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockHospitalUser)
      });

      const response = await request(app)
        .get('/api/admin/overview')
        .set('Authorization', `Bearer ${hospitalToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('PUT /api/admin/hospitals/:id/verify - Verify hospital successfully', async () => {
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAdminUser)
      });

      const mockHospital = {
        _id: '507f1f77bcf86cd799439021',
        isVerified: false,
        save: jest.fn().mockResolvedValue(true)
      };
      Hospital.findById.mockResolvedValue(mockHospital);

      const response = await request(app)
        .put('/api/admin/hospitals/507f1f77bcf86cd799439021/verify')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockHospital.isVerified).toBe(true);
    });
  });
});
