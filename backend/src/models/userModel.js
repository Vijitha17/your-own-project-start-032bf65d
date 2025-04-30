const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
    static async create(userData) {
        const { email, password, role_name, college_name, department_name, first_name, last_name } = userData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            `INSERT INTO users 
            (email, password, role_name, college_name, department_name, first_name, last_name) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [email, hashedPassword, role_name, college_name, department_name, first_name, last_name]
        );
        
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(user_id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
        return rows[0];
    }

    static async update(user_id, userData) {
        const { email, role_name, college_name, department_name, first_name, last_name, is_active } = userData;
        
        const [result] = await pool.query(
            `UPDATE users 
            SET email = ?, role_name = ?, college_name = ?, department_name = ?, 
                first_name = ?, last_name = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?`,
            [email, role_name, college_name, department_name, first_name, last_name, is_active, user_id]
        );
        
        return result.affectedRows > 0;
    }

    static async updatePassword(user_id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const [result] = await pool.query(
            'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
            [hashedPassword, user_id]
        );
        
        return result.affectedRows > 0;
    }

    static async delete(user_id) {
        const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [user_id]);
        return result.affectedRows > 0;
    }

    static async getAllUsers() {
        const [rows] = await pool.query(`
            SELECT u.*, c.college_name, d.department_name 
            FROM users u
            LEFT JOIN colleges c ON u.college_name = c.college_name
            LEFT JOIN departments d ON u.department_name = d.department_name AND u.college_name = d.college_name
        `);
        return rows;
    }

    static async getUsersByCollege(college_name) {
        const [rows] = await pool.query(`
            SELECT u.*, c.college_name, d.department_name 
            FROM users u
            LEFT JOIN colleges c ON u.college_name = c.college_name
            LEFT JOIN departments d ON u.department_name = d.department_name AND u.college_name = d.college_name
            WHERE u.college_name = ?
        `, [college_name]);
        return rows;
    }

    static async getUsersByDepartment(college_name, department_name) {
        const [rows] = await pool.query(`
            SELECT u.*, c.college_name, d.department_name 
            FROM users u
            LEFT JOIN colleges c ON u.college_name = c.college_name
            LEFT JOIN departments d ON u.department_name = d.department_name AND u.college_name = d.college_name
            WHERE u.college_name = ? AND u.department_name = ?
        `, [college_name, department_name]);
        return rows;
    }

    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    static generateToken(user) {
        return jwt.sign(
            { 
                user_id: user.user_id,
                email: user.email,
                role: user.role_name,
                college_name: user.college_name,
                department_name: user.department_name
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    // New methods for dropdowns
    static async getAllColleges() {
        const [rows] = await pool.query('SELECT college_name FROM colleges ORDER BY college_name');
        return rows;
    }

    static async getDepartmentsByCollege(college_name) {
        const [rows] = await pool.query(
            'SELECT department_name FROM departments WHERE college_name = ? ORDER BY department_name',
            [college_name]
        );
        return rows;
    }
}

module.exports = User; 