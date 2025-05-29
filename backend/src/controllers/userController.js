const User = require('../models/userModel');
const { ROLES } = require('../middleware/authMiddleware');

// Login user
const login = async (req, res) => {
    try {
      const { email, password, role } = req.body;
  
      // Find user by email with college and department info
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
  
      // Check if user is active
      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Account is inactive. Please contact administrator'
        });
      }
  
      // Verify password
      if (!user.password) {
        console.error('User password is missing for user:', user);
        return res.status(500).json({
          success: false,
          message: 'User password is missing in database'
        });
      }
      const isMatch = await User.verifyPassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
  
      // Verify role if provided
      if (role && user.role.toLowerCase() !== role.toLowerCase()) {
        return res.status(403).json({
          success: false,
          message: `User does not have ${role} privileges`
        });
      }
  
      // Generate token
      const token = User.generateToken(user);
  
      // Remove sensitive data from response
      const { password: _, ...userData } = user;
  
      res.json({
        success: true,
        token,
        user: userData,
        expiresIn: '24h'
      });
  
    } catch (error) {
      console.error('Login error:', error);
      console.error(error.stack);
      res.status(500).json({
        success: false,
        message: 'Internal server error during authentication'
      });
    }
};

// Create new user (Management Admin only)
const createUser = async (req, res) => {
    try {
        let { user_id, email, password, role, college_id, department_id, first_name, last_name } = req.body;

        // Normalize role to lowercase for comparison
        const normalizedRole = role ? role.toLowerCase() : '';

        // Role-based validation and adjustment
        if (normalizedRole === 'management' || normalizedRole === 'management_admin') {
            // No college or department required
            college_id = null;
            department_id = null;
        } else if (normalizedRole === 'principal') {
            // College required, department not required
            if (!college_id) {
                return res.status(400).json({ message: 'College ID is required for Principal role' });
            }
            department_id = null;
        } else if (normalizedRole === 'hod' || normalizedRole === 'department_incharge') {
            // Both college and department required
            if (!college_id) {
                return res.status(400).json({ message: 'College ID is required for this role' });
            }
            if (!department_id) {
                return res.status(400).json({ message: 'Department ID is required for this role' });
            }
        } else {
            // For other roles, you can define your own logic or default behavior
            // For now, require college and department as optional
            college_id = college_id || null;
            department_id = department_id || null;
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUserId = await User.create({
            user_id,
            email,
            password,
            role,
            college_id,
            department_id,
            first_name,
            last_name
        });

        res.status(201).json({ message: 'User created successfully', user_id: newUserId });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user (Management Admin only)
const updateUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const userData = req.body;

        const updated = await User.update(user_id, userData);
        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (filtered by college for Principal)
const getAllUsers = async (req, res) => {
    try {
        let users;
        
        if (req.user.role === ROLES.PRINCIPAL) {
            if (!req.user.college_id) {
                return res.status(403).json({ 
                    message: 'Principal must be assigned to a college' 
                });
            }
            users = await User.getUsersByCollege(req.user.college_id);
        } else if (req.user.role === ROLES.MANAGEMENT_ADMIN || req.user.role === ROLES.MANAGEMENT) {
            users = await User.getAllUsers();
        } else {
            return res.status(403).json({ 
                message: 'Unauthorized access' 
            });
        }

        console.log('Users fetched:', users.map(u => ({ user_id: u.user_id, role: u.role })));

        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = await User.findById(user_id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If Principal, verify they are accessing a user from their college
        if (req.user.role === ROLES.PRINCIPAL && user.college_id !== req.user.college_id) {
            return res.status(403).json({ message: 'Unauthorized access to this user' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get users by college
const getUsersByCollege = async (req, res) => {
    try {
        const { college_id } = req.params;
        
        // If Principal, verify they are accessing their own college
        if (req.user.role === ROLES.PRINCIPAL && college_id !== req.user.college_id) {
            return res.status(403).json({ message: 'Unauthorized access to this college' });
        }

        const users = await User.getUsersByCollege(college_id);
        res.json(users);
    } catch (error) {
        console.error('Get users by college error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get users by department
const getUsersByDepartment = async (req, res) => {
    try {
        const { college_id, department_id } = req.params;
        
        // If Principal, verify they are accessing their own college
        if (req.user.role === ROLES.PRINCIPAL && college_id !== req.user.college_id) {
            return res.status(403).json({ message: 'Unauthorized access to this department' });
        }

        const users = await User.getUsersByDepartment(college_id, department_id);
        res.json(users);
    } catch (error) {
        console.error('Get users by department error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all colleges for dropdown
const getAllColleges = async (req, res) => {
    try {
        const colleges = await User.getAllColleges();
        res.json(colleges);
    } catch (error) {
        console.error('Get all colleges error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get departments by college for dropdown
const getDepartmentsByCollege = async (req, res) => {
    try {
        const { college_id } = req.params;
        
        // If Principal, verify they are accessing their own college
        if (req.user.role === ROLES.PRINCIPAL && college_id !== req.user.college_id) {
            return res.status(403).json({ message: 'Unauthorized access to this college' });
        }

        const departments = await User.getDepartmentsByCollege(college_id);
        res.json(departments);
    } catch (error) {
        console.error('Get departments by college error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user
const logout = async (req, res) => {
    try {
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get fresh data from database
        const freshUserData = await User.findById(user.user_id);
        if (!freshUserData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove sensitive data
        const { password, ...userWithoutPassword } = freshUserData;
        
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
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
};