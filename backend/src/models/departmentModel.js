const pool = require('../config/database');

class Department {
    static async create(departmentData) {
        const { department_name, college_id } = departmentData;
        const [result] = await pool.query(
            'INSERT INTO departments (department_name, college_id) VALUES (?, ?)',
            [department_name, college_id]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await pool.query(`
            SELECT d.*, COALESCE(c.college_name, 'Unknown College') as college_name 
            FROM departments d
            LEFT JOIN colleges c ON d.college_id = c.college_id
            ORDER BY d.department_name
        `);
        return rows;
    }

    static async getById(department_id) {
        const [rows] = await pool.query(`
            SELECT d.*, COALESCE(c.college_name, 'Unknown College') as college_name 
            FROM departments d
            LEFT JOIN colleges c ON d.college_id = c.college_id
            WHERE d.department_id = ?
        `, [department_id]);
        return rows[0];
    }

    static async getByCollege(college_id) {
        const [rows] = await pool.query(`
            SELECT d.*, COALESCE(c.college_name, 'Unknown College') as college_name 
            FROM departments d
            LEFT JOIN colleges c ON d.college_id = c.college_id
            WHERE d.college_id = ?
            ORDER BY d.department_name
        `, [college_id]);
        return rows;
    }

    static async update(department_id, departmentData) {
        const { department_name, college_id } = departmentData;
        const [result] = await pool.query(
            'UPDATE departments SET department_name = ?, college_id = ?, updated_at = CURRENT_TIMESTAMP WHERE department_id = ?',
            [department_name, college_id, department_id]
        );
        return result.affectedRows > 0;
    }

    static async delete(department_id) {
        const [result] = await pool.query('DELETE FROM departments WHERE department_id = ?', [department_id]);
        return result.affectedRows > 0;
    }
}

module.exports = Department; 