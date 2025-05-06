const db = require('../config/database');

class Category {
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT * FROM Categories ORDER BY category_name');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(categoryId) {
    try {
      const [rows] = await db.query('SELECT * FROM Categories WHERE category_id = ?', [categoryId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(categoryData) {
    try {
      const { category_id, category_name, description } = categoryData;
      const [result] = await db.query(
        'INSERT INTO Categories (category_id, category_name, description) VALUES (?, ?, ?)',
        [category_id, category_name, description]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(categoryId, categoryData) {
    try {
      const { category_name, description } = categoryData;
      const [result] = await db.query(
        'UPDATE Categories SET category_name = ?, description = ? WHERE category_id = ?',
        [category_name, description, categoryId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(categoryId) {
    try {
      const [result] = await db.query('DELETE FROM Categories WHERE category_id = ?', [categoryId]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findByName(categoryName) {
    try {
      const [rows] = await db.query('SELECT * FROM Categories WHERE category_name = ?', [categoryName]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Category; 