const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification
} = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Protected
router.get('/', verifyToken, getNotifications);
router.put('/mark-all-read', verifyToken, markAllRead);
router.put('/:id/read', verifyToken, markRead);
router.delete('/:id', verifyToken, deleteNotification);

module.exports = router;
