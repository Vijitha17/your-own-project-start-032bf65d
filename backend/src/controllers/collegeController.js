const College = require('../models/collegeModel');

// Create new college
const createCollege = async (req, res) => {
    try {
        const { college_name } = req.body;

        // Check if college already exists
        const existingCollege = await College.getAll();
        const collegeExists = existingCollege.some(college => 
            college.college_name.toLowerCase() === college_name.toLowerCase()
        );

        if (collegeExists) {
            return res.status(400).json({ message: 'College already exists' });
        }

        const collegeId = await College.create({ college_name });
        res.status(201).json({ message: 'College created successfully', collegeId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all colleges
const getAllColleges = async (req, res) => {
    try {
        const colleges = await College.getAll();
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get college by ID
const getCollegeById = async (req, res) => {
    try {
        const { college_id } = req.params;
        const college = await College.getById(college_id);
        
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }

        res.json(college);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update college
const updateCollege = async (req, res) => {
    try {
        const { college_id } = req.params;
        const { college_name } = req.body;

        const updated = await College.update(college_id, { college_name });
        if (!updated) {
            return res.status(404).json({ message: 'College not found' });
        }

        res.json({ message: 'College updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete college
const deleteCollege = async (req, res) => {
    try {
        const { college_id } = req.params;
        const deleted = await College.delete(college_id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'College not found' });
        }

        res.json({ message: 'College deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createCollege,
    getAllColleges,
    getCollegeById,
    updateCollege,
    deleteCollege
}; 