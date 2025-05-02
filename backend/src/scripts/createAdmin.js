const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const createAdmin = async () => {
  try {
    // First check if user already exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', ['admin@shanmugha.edu.in']);
    
    if (existingUser.length > 0) {
      console.log('Admin user already exists!');
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(
      `INSERT INTO users 
      (user_id, email, password, role, first_name, last_name) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'F21MA001',
        'admin@shanmugha.edu.in',
        hashedPassword,
        'Management_Admin',
        'Admin',
        'User'
      ]
    );
    
    console.log('Management admin created successfully!');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    // Close the database connection
    pool.end();
  }
};

createAdmin();