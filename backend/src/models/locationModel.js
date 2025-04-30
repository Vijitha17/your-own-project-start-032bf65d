const pool = require('../config/database');

class Location {
    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM locations');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM locations WHERE location_id = ?', [id]);
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

    static async create({ location, location_name, college_id, department_id, description }) {
        const [result] = await pool.query(
            'INSERT INTO locations (location, location_name, college_id, department_id, description) VALUES (?, ?, ?, ?, ?)',
            [location, location_name, college_id, department_id, description]
        );
        return result.insertId;
    }

    static async update(id, { location, location_name, college_id, department_id, description }) {
        const [result] = await pool.query(
            'UPDATE locations SET location = ?, location_name = ?, college_id = ?, department_id = ?, description = ? WHERE location_id = ?',
            [location, location_name, college_id, department_id, description, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await pool.query('DELETE FROM locations WHERE location_id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Location;