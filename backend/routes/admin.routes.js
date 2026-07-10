const express = require('express');
const router = express.Router();
const {
  listUsers,
  getUserById,
  deactivateUser,
  activateUser,
  verifyHospital,
  verifyDonor,
  getOverview,
} = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// All admin routes require token verification and admin role check
router.use(verifyToken, isAdmin);

// GET /api/admin/overview — High-level platform statistics
router.get('/overview', getOverview);

// GET /api/admin/users — List all MERN stack users
router.get('/users', listUsers);

// GET /api/admin/users/:id — Get user details
router.get('/users/:id', getUserById);

// PUT /api/admin/users/:id/deactivate — Soft-deactivate user account
router.put('/users/:id/deactivate', deactivateUser);

// PUT /api/admin/users/:id/activate — Activate user account
router.put('/users/:id/activate', activateUser);

// PUT /api/admin/hospitals/:id/verify — Set verification state for hospital
router.put('/hospitals/:id/verify', verifyHospital);

// PUT /api/admin/donors/:id/verify — Set verification state for donor
router.put('/donors/:id/verify', verifyDonor);

module.exports = router;
