const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentsByCollege,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Department routes
router.get('/', getAllDepartments);
router.get('/:college_id', getDepartmentsByCollege);
router.post('/', createDepartment);
router.put('/:department_id', updateDepartment);
router.delete('/:department_id', deleteDepartment);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Department route error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = router;