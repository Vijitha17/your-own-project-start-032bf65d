const Department = require('../models/departmentModel');

// Create new department
const createDepartment = async (req, res) => {
    try {
        const { department_name, college_id } = req.body;

        // Check if department already exists in the college
        const existingDepartments = await Department.getByCollege(college_id);
        const departmentExists = existingDepartments.some(dept => 
            dept.department_name.toLowerCase() === department_name.toLowerCase()
        );

        if (departmentExists) {
            return res.status(400).json({ message: 'Department already exists in this college' });
        }

        const departmentId = await Department.create({ department_name, college_id });
        res.status(201).json({ message: 'Department created successfully', departmentId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.getAll();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
    try {
        const { department_id } = req.params;
        const department = await Department.getById(department_id);
        
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        res.json(department);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get departments by college
const getDepartmentsByCollege = async (req, res) => {
    try {
        const { college_id } = req.params;
        const departments = await Department.getByCollege(college_id);
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update department
const updateDepartment = async (req, res) => {
    try {
        const { department_id } = req.params;
        const { department_name, college_id } = req.body;

        const updated = await Department.update(department_id, { department_name, college_id });
        if (!updated) {
            return res.status(404).json({ message: 'Department not found' });
        }

        res.json({ message: 'Department updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete department
const deleteDepartment = async (req, res) => {
    try {
        const { department_id } = req.params;
        const deleted = await Department.delete(department_id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Department not found' });
        }

        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    getDepartmentsByCollege,
    updateDepartment,
    deleteDepartment
}; 