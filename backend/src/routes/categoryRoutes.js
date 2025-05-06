const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, isManagementAdmin } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware());

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Create new category (only admin)
router.post('/', isManagementAdmin, categoryController.createCategory);

// Update category (only admin)
router.put('/:id', isManagementAdmin, categoryController.updateCategory);

// Delete category (only admin)
router.delete('/:id', isManagementAdmin, categoryController.deleteCategory);

module.exports = router; 