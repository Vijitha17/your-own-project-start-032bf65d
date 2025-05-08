const Location = require('../models/locationModel');
const { ROLES } = require('../middleware/authMiddleware');

/**
 * Get all locations with role-based filtering
 */
const getAllLocations = async (req, res) => {
    try {
        let locations;
        const user = req.user;

        // Filter locations based on user role
        switch (user.role) {
            case ROLES.MANAGEMENT_ADMIN:
                // Management Admin can see all locations
                locations = await Location.getAll();
                break;

            case ROLES.PRINCIPAL:
                // Principal can only see locations in their college
                if (!user.college_id) {
                    return res.status(403).json({
                        success: false,
                        message: 'Principal must be assigned to a college'
                    });
                }
                locations = await Location.getByCollege(user.college_id);
                break;

            case ROLES.HOD:
            case ROLES.DEPARTMENT_INCHARGE:
                // HOD and Department Incharge can only see locations in their department
                if (!user.department_id) {
                    return res.status(403).json({
                        success: false,
                        message: 'User must be assigned to a department'
                    });
                }
                locations = await Location.getByDepartment(user.department_id);
                break;

            default:
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized access'
                });
        }

        res.json({
            success: true,
            data: locations
        });
    } catch (error) {
        console.error('Get locations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch locations',
            error: error.message
        });
    }
};

/**
 * Get a location by ID
 */
const getLocationById = async (req, res) => {
    try {
        const { location_id } = req.params;
        const location = await Location.getById(location_id);
        
        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        res.json({
            success: true,
            data: location
        });
    } catch (error) {
        console.error('Get location by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch location',
            error: error.message
        });
    }
};

/**
 * Get locations by college
 */
const getLocationsByCollege = async (req, res) => {
    try {
        const { college_id } = req.params;
        const locations = await Location.getByCollege(college_id);
        
        res.json({
            success: true,
            data: locations
        });
    } catch (error) {
        console.error('Get locations by college error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch locations for this college',
            error: error.message
        });
    }
};

/**
 * Get locations by department
 */
const getLocationsByDepartment = async (req, res) => {
    try {
        const { department_id } = req.params;
        const locations = await Location.getByDepartment(department_id);
        
        res.json({
            success: true,
            data: locations
        });
    } catch (error) {
        console.error('Get locations by department error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch locations for this department',
            error: error.message
        });
    }
};

/**
 * Create a new location
 */
const createLocation = async (req, res) => {
    try {
        const { location_id, location_name, college_id, department_id, location_type, description } = req.body;

        // Validate input
        if (!location_id || !location_name || !college_id || !location_type) {
            return res.status(400).json({
                success: false,
                message: 'Location ID, name, college ID, and location type are required'
            });
        }

        // Check if location already exists
        const existingLocation = await Location.findByName(location_name);
        if (existingLocation) {
            return res.status(400).json({
                success: false,
                message: 'Location with this name already exists'
            });
        }

        // Create location
        await Location.create({ 
            location_id, 
            location_name, 
            college_id, 
            department_id, 
            location_type, 
            description 
        });

        res.status(201).json({
            success: true,
            message: 'Location created successfully',
            location_id
        });
    } catch (error) {
        console.error('Create location error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create location',
            error: error.message
        });
    }
};

/**
 * Update a location
 */
const updateLocation = async (req, res) => {
    try {
        const { location_id } = req.params;
        const { location_name, college_id, department_id, location_type, description } = req.body;

        // Validate input
        if (!location_name || !location_type) {
            return res.status(400).json({
                success: false,
                message: 'Location name and type are required'
            });
        }

        // Check if the location exists
        const location = await Location.getById(location_id);
        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        // Update location
        const updated = await Location.update(location_id, {
            location_name,
            college_id: college_id || location.college_id,
            department_id: department_id || location.department_id,
            location_type,
            description: description || location.description
        });

        if (!updated) {
            return res.status(500).json({
                success: false,
                message: 'Failed to update location'
            });
        }

        res.json({
            success: true,
            message: 'Location updated successfully'
        });
    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update location',
            error: error.message
        });
    }
};

/**
 * Delete a location
 */
const deleteLocation = async (req, res) => {
    try {
        const { location_id } = req.params;
        
        // Check if the location exists
        const location = await Location.getById(location_id);
        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        // Delete location
        const deleted = await Location.delete(location_id);
        
        if (!deleted) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete location'
            });
        }

        res.json({
            success: true,
            message: 'Location deleted successfully'
        });
    } catch (error) {
        console.error('Delete location error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete location',
            error: error.message
        });
    }
};

module.exports = {
    getAllLocations,
    getLocationById,
    getLocationsByCollege,
    getLocationsByDepartment,
    createLocation,
    updateLocation,
    deleteLocation
};