const User = require('../models/userModel');
const { isManagementAdmin } = require('../middleware/authMiddleware');

// Login user
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is active
        if (user.is_active === 0) {
            return res.status(401).json({ message: 'Account is inactive' });
        }

        // Check password
        const isMatch = await User.verifyPassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check role if provided
        if (role && user.role_name.toLowerCase() !== role.toLowerCase()) {
            return res.status(401).json({ message: 'Invalid role' });
        }

        // Generate token
        const token = User.generateToken(user);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new user (Management Admin only)
const createUser = async (req, res) => {
    try {
        const { email, password, role_name, college_name, department_name, first_name, last_name } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const userId = await User.create({
            email,
            password,
            role_name,
            college_name,
            department_name,
            first_name,
            last_name
        });

        res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
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
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (Management Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
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

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get users by college
const getUsersByCollege = async (req, res) => {
    try {
        const { college_name } = req.params;
        const users = await User.getUsersByCollege(college_name);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get users by department
const getUsersByDepartment = async (req, res) => {
    try {
        const { college_name, department_name } = req.params;
        const users = await User.getUsersByDepartment(college_name, department_name);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all colleges for dropdown
const getAllColleges = async (req, res) => {
    try {
        const colleges = await User.getAllColleges();
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get departments by college for dropdown
const getDepartmentsByCollege = async (req, res) => {
    try {
        const { college_name } = req.params;
        const departments = await User.getDepartmentsByCollege(college_name);
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user
const logout = async (req, res) => {
    try {
        // In a real application, you might want to:
        // 1. Blacklist the token
        // 2. Clear session data
        // 3. Update user's last logout time
        
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
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
        
        res.json({
            ...userWithoutPassword,
            // Add any additional profile data you want to include
            created_at: freshUserData.created_at,
            updated_at: freshUserData.updated_at
        });
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