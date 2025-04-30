const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, '..', 'src', 'database', 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');

    console.log('Executing schema...');
    await connection.query(schema);
    console.log('Database initialized successfully!');

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

initializeDatabase(); 