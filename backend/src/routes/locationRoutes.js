const express = require('express');
const router = express.Router();
const { 
    createLocation, 
    getAllLocations, 
    getLocationById, 
    getLocationsByCollege,
    getLocationsByDepartment,
    updateLocation, 
    deleteLocation 
} = require('../controllers/locationController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Location routes
router.post('/', createLocation);
router.get('/', getAllLocations);
router.get('/:location_id', getLocationById);
router.get('/college/:college_id', getLocationsByCollege);
router.get('/department/:department_id', getLocationsByDepartment);
router.put('/:location_id', updateLocation);
router.delete('/:location_id', deleteLocation);

// Error handling middleware for location routes
router.use((err, req, res, next) => {
    console.error('Location route error:', err);
    res.status(500).json({ 
        message: 'Error processing location request',
        error: err.message 
    });
});

module.exports = router; 