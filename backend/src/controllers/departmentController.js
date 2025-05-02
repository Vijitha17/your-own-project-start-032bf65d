const Department = require('../models/departmentModel');
const pool = require('../config/database');

// Get all departments with college names
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.getAll();
    
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
};

// Get single department by ID
const getDepartmentById = async (req, res) => {
  try {
    const { department_id } = req.params;
    const department = await Department.getById(department_id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department',
      error: error.message
    });
  }
};

// Get departments by college ID
const getDepartmentsByCollege = async (req, res) => {
  try {
    const { college_id } = req.params;
    
    // Verify college exists
    const [college] = await pool.query(
      'SELECT 1 FROM colleges WHERE college_id = ?',
      [college_id]
    );
    
    if (!college.length) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    const departments = await Department.getByCollege(college_id);
    
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments by college:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments by college',
      error: error.message
    });
  }
};

// Create new department
const createDepartment = async (req, res) => {
  try {
    const { department_name, college_id } = req.body;

    // Validation
    if (!department_name || !college_id) {
      return res.status(400).json({
        success: false,
        message: 'Department name and college ID are required'
      });
    }

    // Verify college exists
    const [college] = await pool.query(
      'SELECT college_id FROM colleges WHERE college_id = ?',
      [college_id]
    );

    if (!college.length) {
      return res.status(400).json({
        success: false,
        message: 'College does not exist'
      });
    }

    // Check for existing department in the same college
    const [existing] = await pool.query(
      'SELECT 1 FROM departments WHERE department_name = ? AND college_id = ?',
      [department_name, college_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Department already exists in this college'
      });
    }

    // Create new department
    const departmentId = await Department.create({
      department_name,
      college_id
    });

    // Get the created department with college details
    const [newDepartment] = await pool.query(`
      SELECT d.*, c.college_name 
      FROM departments d
      JOIN colleges c ON d.college_id = c.college_id
      WHERE d.department_id = ?
    `, [departmentId]);

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: newDepartment[0]
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create department',
      error: error.message
    });
  }
};

// Update existing department
const updateDepartment = async (req, res) => {
  try {
    const { department_id } = req.params;
    const { department_name, college_id } = req.body;

    // Validation
    if (!department_name || !college_id) {
      return res.status(400).json({
        success: false,
        message: 'Department name and college ID are required'
      });
    }

    // Verify department exists
    const department = await Department.getById(department_id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Verify college exists
    const [college] = await pool.query(
      'SELECT 1 FROM colleges WHERE college_id = ?',
      [college_id]
    );

    if (!college.length) {
      return res.status(400).json({
        success: false,
        message: 'College does not exist'
      });
    }

    // Check for name conflict
    const [existing] = await pool.query(
      'SELECT 1 FROM departments WHERE department_name = ? AND college_id = ? AND department_id != ?',
      [department_name, college_id, department_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Another department with this name already exists in this college'
      });
    }

    // Update department
    const updated = await Department.update(department_id, {
      department_name,
      college_id
    });

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update department'
      });
    }

    // Get the updated department with college details
    const [updatedDepartment] = await pool.query(`
      SELECT d.*, c.college_name 
      FROM departments d
      JOIN colleges c ON d.college_id = c.college_id
      WHERE d.department_id = ?
    `, [department_id]);

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: updatedDepartment[0]
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update department',
      error: error.message
    });
  }
};

// Delete department
const deleteDepartment = async (req, res) => {
  try {
    const { department_id } = req.params;
    
    // Verify department exists
    const department = await Department.getById(department_id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    const deleted = await Department.delete(department_id);
    
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete department'
      });
    }

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete department',
      error: error.message
    });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  getDepartmentsByCollege,
  createDepartment,
  updateDepartment,
  deleteDepartment
};