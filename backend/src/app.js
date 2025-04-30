const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/locations', locationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app; 