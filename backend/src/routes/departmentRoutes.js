const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  getDepartmentsByCollege,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Route to get departments by college - available to all authenticated users
// This needs to be defined before any middleware that applies to all routes
router.get('/college/:college_id', authMiddleware(), getDepartmentsByCollege);

// Apply restricted authentication middleware to admin/management routes
router.get('/', authMiddleware(['Management_Admin', 'Principal']), getAllDepartments);
router.get('/:department_id', authMiddleware(['Management_Admin', 'Principal']), getDepartmentById);
router.post('/', authMiddleware(['Management_Admin', 'Principal']), createDepartment);
router.put('/:department_id', authMiddleware(['Management_Admin', 'Principal']), updateDepartment);
router.delete('/:department_id', authMiddleware(['Management_Admin', 'Principal']), deleteDepartment);

module.exports = router;