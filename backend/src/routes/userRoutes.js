const express = require('express');
const router = express.Router();
const { 
    login, 
    createUser, 
    updateUser, 
    getAllUsers, 
    getUserById, 
    getUsersByCollege, 
    getUsersByDepartment,
    getAllColleges,
    getDepartmentsByCollege,
    logout,
    getProfile
} = require('../controllers/userController');
const { isManagementAdmin, authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authMiddleware(), (req, res) => {
    res.json(req.user);
});

router.get('/profile', authMiddleware(), getProfile);

// Dropdown data routes
router.get('/colleges', getAllColleges);
router.get('/colleges/:college_name/departments', getDepartmentsByCollege);

// Management Admin only routes
router.post('/users', isManagementAdmin, createUser);
router.put('/users/:user_id', isManagementAdmin, updateUser);
router.get('/users', isManagementAdmin, getAllUsers);
router.get('/users/:user_id', isManagementAdmin, getUserById);
router.get('/college/:college_name/users', isManagementAdmin, getUsersByCollege);
router.get('/college/:college_name/department/:department_name/users', isManagementAdmin, getUsersByDepartment);

module.exports = router; 