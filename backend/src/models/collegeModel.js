const pool = require('../config/database');

class College {
    static async create(collegeData) {
        const { college_name } = collegeData;
        const [result] = await pool.query(
            'INSERT INTO colleges (college_name) VALUES (?)',
            [college_name]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM colleges ORDER BY college_name');
        return rows;
    }

    static async getById(college_id) {
        const [rows] = await pool.query('SELECT * FROM colleges WHERE college_id = ?', [college_id]);
        return rows[0];
    }

    static async update(college_id, collegeData) {
        const { college_name } = collegeData;
        const [result] = await pool.query(
            'UPDATE colleges SET college_name = ?, updated_at = CURRENT_TIMESTAMP WHERE college_id = ?',
            [college_name, college_id]
        );
        return result.affectedRows > 0;
    }

    static async delete(college_id) {
        const [result] = await pool.query('DELETE FROM colleges WHERE college_id = ?', [college_id]);
        return result.affectedRows > 0;
    }
}

module.exports = College; 