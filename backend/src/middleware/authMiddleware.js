const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = (roles = []) => {
    return async (req, res, next) => {
        try {
            // Get token from header
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ message: 'No token, authorization denied' });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from database
            const user = await User.findById(decoded.user_id);
            
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            if (!user.is_active) {
                return res.status(401).json({ message: 'User account is deactivated' });
            }

            // Check if user has required role
            if (roles.length > 0 && !roles.includes(user.role_name)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Add user to request object
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token is not valid' });
        }
    };
};

// Specific role middleware
const isManagementAdmin = authMiddleware(['Management_Admin']);
const isManagement = authMiddleware(['Management']);
const isPrincipal = authMiddleware(['Principal']);
const isHOD = authMiddleware(['HOD']);
const isDepartmentIncharge = authMiddleware(['Department_Incharge']);

module.exports = {
    authMiddleware,
    isManagementAdmin,
    isManagement,
    isPrincipal,
    isHOD,
    isDepartmentIncharge
}; 