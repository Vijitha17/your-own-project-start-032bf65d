const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'viji@2003@E21CS056',
  database: process.env.DB_NAME || 'imsfinaldb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// Error handling
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // Handle connection loss
  } else {
    throw err;
  }
});

module.exports = pool;