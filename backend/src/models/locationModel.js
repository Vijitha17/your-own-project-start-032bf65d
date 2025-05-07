const pool = require('../config/database');

class Location {
    static async getAll() {
        const [rows] = await pool.query(`
            SELECT l.*, c.college_name, d.department_name 
            FROM locations l
            LEFT JOIN colleges c ON l.college_id = c.college_id
            LEFT JOIN departments d ON l.department_id = d.department_id
            ORDER BY l.location_name
        `);
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query(`
            SELECT l.*, c.college_name, d.department_name 
            FROM locations l
            LEFT JOIN colleges c ON l.college_id = c.college_id
            LEFT JOIN departments d ON l.department_id = d.department_id
            WHERE l.location_id = ?
        `, [id]);
        return rows[0];
    }

    static async getByCollege(collegeId) {
        const [rows] = await pool.query('SELECT * FROM locations WHERE college_id = ?', [collegeId]);
        return rows;
    }

    static async getByDepartment(departmentId) {
        const [rows] = await pool.query('SELECT * FROM locations WHERE department_id = ?', [departmentId]);
        return rows;
    }

    static async create({ location_id, location_name, college_id, department_id, location_type, description }) {
        const [result] = await pool.query(
            'INSERT INTO locations (location_id, location_name, college_id, department_id, location_type, description) VALUES (?, ?, ?, ?, ?, ?)',
            [location_id, location_name, college_id, department_id, location_type, description]
        );
        return location_id;
    }

    static async update(id, { location_name, college_id, department_id, location_type, description }) {
        const [result] = await pool.query(
            'UPDATE locations SET location_name = ?, college_id = ?, department_id = ?, location_type = ?, description = ? WHERE location_id = ?',
            [location_name, college_id, department_id, location_type, description, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.query('DELETE FROM locations WHERE location_id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async findByName(locationName) {
        const [rows] = await pool.query('SELECT * FROM locations WHERE location_name = ?', [locationName]);
        return rows[0];
    }
}

module.exports = Location;