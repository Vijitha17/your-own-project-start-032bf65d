const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
    getNotificationsByUser,
    markNotificationAsRead
} = require('../controllers/notificationController');

router.get('/', authMiddleware(), getNotificationsByUser);
router.put('/:notification_id/read', authMiddleware(), markNotificationAsRead);

module.exports = router;
