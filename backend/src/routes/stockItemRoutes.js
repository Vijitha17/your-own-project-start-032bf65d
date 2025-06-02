const express = require('express');
const router = express.Router();
const stockItemController = require('../controllers/stockItemController');

// Route to handle bulk creation of stock items
router.post('/bulk', stockItemController.bulkCreateStockItems);

module.exports = router;
