const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Department {
  static async create(departmentData) {
    const { department_name, college_id } = departmentData;
    const department_id = uuidv4(); // Generate UUID for department_id
    
    const [result] = await pool.query(
      'INSERT INTO departments (department_id, department_name, college_id) VALUES (?, ?, ?)',
      [department_id, department_name, college_id]
    );
    
    return department_id; // Return the generated UUID
  }

  static async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT d.department_id, d.department_name, d.college_id, 
               c.college_name, d.created_at, d.updated_at
        FROM departments d
        JOIN colleges c ON d.college_id = c.college_id
        ORDER BY d.created_at DESC
      `);
      return rows;
    } catch (error) {
      console.error("Critical database error:", error);
      return [];
    }
  }

  static async getById(department_id) {
    try {
      const [rows] = await pool.query(`
        SELECT d.*, c.college_name 
        FROM departments d
        JOIN colleges c ON d.college_id = c.college_id
        WHERE d.department_id = ?
      `, [department_id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error in getById:", error);
      return null;
    }
  }

  static async getByCollege(college_id) {
    try {
      const [rows] = await pool.query(`
        SELECT d.*, c.college_name 
        FROM departments d
        JOIN colleges c ON d.college_id = c.college_id
        WHERE d.college_id = ?
        ORDER BY d.department_name
      `, [college_id]);
      return rows;
    } catch (error) {
      console.error("Error in getByCollege:", error);
      return [];
    }
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
    const [result] = await pool.query(
      'DELETE FROM departments WHERE department_id = ?',
      [department_id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Department;