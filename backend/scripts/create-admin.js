const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdminUser() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'imsfinal'
  });

  try {
    // Create a default college
    await connection.query(
      'INSERT INTO colleges (college_name) VALUES (?)',
      ['Default College']
    );

    // Create a default department
    await connection.query(
      'INSERT INTO departments (department_name, college_name) VALUES (?, ?)',
      ['Default Department', 'Default College']
    );

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(
      `INSERT INTO users 
      (email, password, role, college_name, department_name, first_name, last_name) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['admin@example.com', hashedPassword, 'Management_Admin', 'Default College', 'Default Department', 'Admin', 'User']
    );

    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await connection.end();
  }
}

createAdminUser(); 