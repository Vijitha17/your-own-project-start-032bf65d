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
  getProfile,
  getUsersByRole
} = require('../controllers/userController');
const { authMiddleware, ROLES } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (require authentication but no specific role)
router.get('/me', authMiddleware(), (req, res) => {
  res.json({ 
    success: true,
    user: req.user 
  });
});

router.get('/profile', authMiddleware(), getProfile);

// College/department dropdown data (available to all authenticated users)
router.get('/colleges', authMiddleware(), getAllColleges);
router.get('/colleges/:college_id/departments', authMiddleware(), getDepartmentsByCollege);

// User Management Routes
router.post('/users', 
  authMiddleware([ROLES.MANAGEMENT_ADMIN]), 
  createUser
);

router.put('/users/:user_id', 
  authMiddleware([ROLES.MANAGEMENT_ADMIN]), 
  updateUser
);

// Get users by role - This needs to come before /users/:user_id
router.get('/users/role/:role', 
  authMiddleware(), // Allow all authenticated users to fetch approvers
  getUsersByRole
);

router.get('/users', 
  authMiddleware([ROLES.MANAGEMENT_ADMIN, ROLES.PRINCIPAL, ROLES.MANAGEMENT]), 
  getAllUsers
);

router.get('/users/:user_id', 
  authMiddleware([ROLES.MANAGEMENT_ADMIN, ROLES.PRINCIPAL]), 
  getUserById
);

router.get('/college/:college_id/users', 
  authMiddleware([ROLES.MANAGEMENT_ADMIN, ROLES.PRINCIPAL, ROLES.HOD]), 
  getUsersByCollege
);

router.get('/college/:college_id/department/:department_id/users', 
  authMiddleware([ROLES.MANAGEMENT_ADMIN, ROLES.HOD, ROLES.DEPARTMENT_INCHARGE]), 
  getUsersByDepartment
);

module.exports = router;