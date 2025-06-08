const express = require('express');
const router = express.Router();
const { createRequest, getRequestById, getRequests } = require('../controllers/requestController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get all requests
router.get('/', authMiddleware(), getRequests);

// Create a new request
router.post('/', authMiddleware(), createRequest);

// Get request by ID
router.get('/:id', authMiddleware(), getRequestById);

module.exports = router; 