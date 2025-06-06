const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const ROLES = {
  MANAGEMENT_ADMIN: 'Management_Admin',
  MANAGEMENT: 'Management',
  PRINCIPAL: 'Principal',
  HOD: 'HOD',
  DEPARTMENT_INCHARGE: 'Department_Incharge'
};

const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        console.log('AuthMiddleware: No token provided');
        return res.status(401).json({
          success: false,
          message: 'Authentication token required'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('AuthMiddleware: Decoded token:', decoded);
      
      const [users] = await pool.query(
        `SELECT u.*, c.college_name, d.department_name 
         FROM users u
         LEFT JOIN colleges c ON u.college_id = c.college_id
         LEFT JOIN departments d ON u.department_id = d.department_id
         WHERE u.user_id = ?`,
        [decoded.user_id]
      );

      if (!users.length) {
        console.log('AuthMiddleware: User not found for user_id:', decoded.user_id);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];
      console.log('AuthMiddleware: Authenticated user:', user);

      // Check if user is active
      if (!user.is_active) {
        console.log('AuthMiddleware: User account inactive:', user.user_id);
        return res.status(403).json({
          success: false,
          message: 'User account is inactive'
        });
      }

      // Check role authorization
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log('AuthMiddleware: Insufficient permissions for user:', user.user_id, 'Required roles:', allowedRoles);
        return res.status(403).json({
          success: false,
          message: `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  };
};

const isManagementAdmin = authMiddleware([ROLES.MANAGEMENT_ADMIN]);

const isAuthorizedRole = (allowedRoles) => {
  return authMiddleware(allowedRoles);
};

module.exports = {
  authMiddleware,
  isManagementAdmin,
  isAuthorizedRole,
  ROLES
};