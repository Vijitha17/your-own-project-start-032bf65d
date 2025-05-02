const pool = require('../config/database');

class College {
    static async create(collegeData) {
        const { college_id, college_name } = collegeData;
        const [result] = await pool.query(
            'INSERT INTO colleges (college_id, college_name) VALUES (?, ?)',
            [college_id, college_name]
        );
        return college_id; // Return the provided ID instead of insertId
    }

    static async getAll() {
        const [rows] = await pool.query(`
            SELECT 
                college_id,
                college_name,
                created_at,
                updated_at
            FROM colleges 
            ORDER BY college_name
        `);
        return rows;
    }

    static async getById(college_id) {
        const [rows] = await pool.query(`
            SELECT 
                college_id,
                college_name,
                created_at,
                updated_at
            FROM colleges 
            WHERE college_id = ?
        `, [college_id]);
        return rows[0] || null;
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
        const [result] = await pool.query(
            'DELETE FROM colleges WHERE college_id = ?', 
            [college_id]
        );
        return result.affectedRows > 0;
    }

    // New method to check if college exists
    static async exists(college_id) {
        const [rows] = await pool.query(
            'SELECT 1 FROM colleges WHERE college_id = ?',
            [college_id]
        );
        return rows.length > 0;
    }
}

module.exports = College;