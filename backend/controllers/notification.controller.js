const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/helpers');

/**
 * Retrieve notifications of logged-in user
 */
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return sendSuccess(res, notifications, 'Notifications retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Mark notification as read
 */
const markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return sendError(res, 'Notification not found', 404);
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized to read this notification', 403);
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return sendSuccess(res, notification, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
};

/**
 * Mark all notifications as read
 */
const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return sendSuccess(res, {}, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a specific notification
 */
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return sendError(res, 'Notification not found', 404);
    }

    if (notification.recipient.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Unauthorized to delete this notification', 403);
    }

    await Notification.findByIdAndDelete(req.params.id);
    return sendSuccess(res, {}, 'Notification deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
};
