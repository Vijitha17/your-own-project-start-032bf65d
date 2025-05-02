const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ROLES } = require('../middleware/authMiddleware');

class User {
    static async create(userData) {
        const { user_id, email, password, role, college_id, department_id, first_name, last_name } = userData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            `INSERT INTO users 
            (user_id, email, password, role, college_id, department_id, first_name, last_name) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, email, hashedPassword, role, college_id, department_id, first_name, last_name]
        );
        
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.query(`
            SELECT u.*, c.college_name, d.department_name 
            FROM users u
            LEFT JOIN colleges c ON u.college_id = c.college_id
            LEFT JOIN departments d ON u.department_id = d.department_id
            WHERE u.email = ?`, 
            [email]
        );
        return rows[0];
    }

    static async findById(user_id) {
        const [rows] = await pool.query(`
            SELECT u.*, c.college_name, d.department_name 
            FROM users u
            LEFT JOIN colleges c ON u.college_id = c.college_id
            LEFT JOIN departments d ON u.department_id = d.department_id
            WHERE u.user_id = ?`, 
            [user_id]
        );
        return rows[0];
    }

    static async update(user_id, userData) {
        const { email, role, college_id, department_id, first_name, last_name, is_active } = userData;
        
        const [result] = await pool.query(
            `UPDATE users 
            SET email = ?, role = ?, college_id = ?, department_id = ?, 
                first_name = ?, last_name = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?`,
            [email, role, college_id, department_id, first_name, last_name, is_active, user_id]
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
            SELECT 
                u.user_id,
                u.email,
                u.role,
                u.first_name,
                u.last_name,
                u.is_active,
                u.created_at,
                u.updated_at,
                c.college_name,
                d.department_name
            FROM users u
            LEFT JOIN colleges c ON u.college_id = c.college_id
            LEFT JOIN departments d ON u.department_id = d.department_id
            ORDER BY u.created_at DESC
        `);
        return rows;
    }

    static async getUsersByCollege(college_id) {
        const [rows] = await pool.query(`
            SELECT 
                u.user_id,
                u.email,
                u.role,
                u.first_name,
                u.last_name,
                u.is_active,
                u.created_at,
                u.updated_at,
                c.college_name,
                d.department_name
            FROM users u
            LEFT JOIN colleges c ON u.college_id = c.college_id
            LEFT JOIN departments d ON u.department_id = d.department_id
            WHERE u.college_id = ?
            ORDER BY u.created_at DESC
        `, [college_id]);
        return rows;
    }

    static async getUsersByDepartment(college_id, department_id) {
        const [rows] = await pool.query(`
            SELECT 
                u.user_id,
                u.email,
                u.role,
                u.first_name,
                u.last_name,
                u.is_active,
                u.created_at,
                u.updated_at,
                c.college_name,
                d.department_name
            FROM users u
            LEFT JOIN colleges c ON u.college_id = c.college_id
            LEFT JOIN departments d ON u.department_id = d.department_id
            WHERE u.college_id = ? AND u.department_id = ?
            ORDER BY u.created_at DESC
        `, [college_id, department_id]);
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
                role: user.role,
                college_id: user.college_id,
                department_id: user.department_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    static async verifyRole(user_id, requiredRole) {
        const user = await this.findById(user_id);
        if (!user) return false;
        return user.role === requiredRole;
    }

    static async getAllColleges() {
        const [rows] = await pool.query('SELECT college_id, college_name FROM colleges ORDER BY college_name');
        return rows;
    }

    static async getDepartmentsByCollege(college_id) {
        const [rows] = await pool.query(
            'SELECT department_id, department_name FROM departments WHERE college_id = ? ORDER BY department_name',
            [college_id]
        );
        return rows;
    }
}

module.exports = User;