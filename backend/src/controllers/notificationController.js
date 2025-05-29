const Notification = require('../models/notificationModel');

// Get notifications for a user
const getNotificationsByUser = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const notifications = await Notification.findByUser(userId);
        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.notification_id;
        const success = await Notification.markAsRead(notificationId);
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }
        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Mark notification as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getNotificationsByUser,
    markNotificationAsRead
};
