const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight request for 10 minutes
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/auth/colleges', collegeRoutes);
app.use('/api/auth/departments', departmentRoutes);
app.use('/api/auth/locations', locationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Inventory Management System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});