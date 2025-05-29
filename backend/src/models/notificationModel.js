const pool = require('../config/database');

class Notification {
    static async create(notificationData) {
        const query = `
            INSERT INTO Notifications (
                user_id,
                message,
                is_read,
                created_at
            ) VALUES (?, ?, false, CURRENT_TIMESTAMP)
        `;
        const values = [
            notificationData.user_id,
            notificationData.message
        ];
        const [result] = await pool.execute(query, values);
        return result.insertId;
    }

    static async findByUser(userId) {
        const query = `
            SELECT notification_id, user_id, message, is_read, created_at
            FROM Notifications
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;
        const [rows] = await pool.execute(query, [userId]);
        return rows;
    }

    static async markAsRead(notificationId) {
        const query = `
            UPDATE Notifications
            SET is_read = true
            WHERE notification_id = ?
        `;
        const [result] = await pool.execute(query, [notificationId]);
        return result.affectedRows > 0;
    }
}

module.exports = Notification;
