const College = require('../models/collegeModel');
const { ROLES } = require('../middleware/authMiddleware');

const createCollege = async (req, res) => {
    try {
        const { college_id, college_name } = req.body;

        // Validate input
        if (!college_id || !college_name) {
            return res.status(400).json({
                success: false,
                message: 'College ID and name are required'
            });
        }

        // Check if college already exists
        const exists = await College.exists(college_id);
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'College with this ID already exists'
            });
        }

        // Create college
        await College.create({ college_id, college_name });

        res.status(201).json({
            success: true,
            message: 'College created successfully',
            college_id
        });
    } catch (error) {
        console.error('Create college error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create college',
            error: error.message
        });
    }
};

const getAllColleges = async (req, res) => {
    try {
        const colleges = await College.getAll();
        res.json({
            success: true,
            data: colleges
        });
    } catch (error) {
        console.error('Get colleges error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch colleges',
            error: error.message
        });
    }
};

const getCollegeById = async (req, res) => {
    try {
        const { college_id } = req.params;
        const college = await College.getById(college_id);
        
        if (!college) {
            return res.status(404).json({
                success: false,
                message: 'College not found'
            });
        }

        res.json({
            success: true,
            data: college
        });
    } catch (error) {
        console.error('Get college by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch college',
            error: error.message
        });
    }
};

const updateCollege = async (req, res) => {
    try {
        const { college_id } = req.params;
        const { college_name } = req.body;

        // Validate input
        if (!college_name) {
            return res.status(400).json({
                success: false,
                message: 'College name is required'
            });
        }

        const updated = await College.update(college_id, { college_name });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'College not found'
            });
        }

        res.json({
            success: true,
            message: 'College updated successfully'
        });
    } catch (error) {
        console.error('Update college error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update college',
            error: error.message
        });
    }
};

const deleteCollege = async (req, res) => {
    try {
        const { college_id } = req.params;
        const deleted = await College.delete(college_id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'College not found'
            });
        }

        res.json({
            success: true,
            message: 'College deleted successfully'
        });
    } catch (error) {
        console.error('Delete college error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete college',
            error: error.message
        });
    }
};

module.exports = {
    createCollege,
    getAllColleges,
    getCollegeById,
    updateCollege,
    deleteCollege
};