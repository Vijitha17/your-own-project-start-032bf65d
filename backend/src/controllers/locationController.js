const Location = require('../models/locationModel');

// Create new location
const createLocation = async (req, res) => {
    try {
        const { location, location_name, college_id, department_id, description } = req.body;

        // Check if location already exists
        const existingLocations = await Location.getAll();
        const locationExists = existingLocations.some(loc => 
            loc.location_name.toLowerCase() === location_name.toLowerCase() &&
            loc.college_id === college_id &&
            loc.department_id === department_id
        );

        if (locationExists) {
            return res.status(400).json({ message: 'Location already exists' });
        }

        const locationId = await Location.create({
            location,
            location_name,
            college_id,
            department_id,
            description
        });
        
        res.status(201).json({ message: 'Location created successfully', locationId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all locations
const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.getAll();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get location by ID
const getLocationById = async (req, res) => {
    try {
        const { location_id } = req.params;
        const location = await Location.getById(location_id);
        
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.json(location);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get locations by college
const getLocationsByCollege = async (req, res) => {
    try {
        const { college_id } = req.params;
        const locations = await Location.getByCollege(college_id);
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get locations by department
const getLocationsByDepartment = async (req, res) => {
    try {
        const { department_id } = req.params;
        const locations = await Location.getByDepartment(department_id);
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update location
const updateLocation = async (req, res) => {
    try {
        const { location_id } = req.params;
        const { location, location_name, college_id, department_id, description } = req.body;

        const updated = await Location.update(location_id, {
            location,
            location_name,
            college_id,
            department_id,
            description
        });
        
        if (!updated) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.json({ message: 'Location updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete location
const deleteLocation = async (req, res) => {
    try {
        const { location_id } = req.params;
        const deleted = await Location.delete(location_id);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.json({ message: 'Location deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createLocation,
    getAllLocations,
    getLocationById,
    getLocationsByCollege,
    getLocationsByDepartment,
    updateLocation,
    deleteLocation
}; 