const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authMiddleware, isManagementAdmin, isAuthorizedRole } = require('../middleware/authMiddleware');

router.use(authMiddleware());

// Get all locations - accessible by all authorized roles
router.get('/', isAuthorizedRole(['Management_Admin', 'Principal', 'HOD', 'Department_Incharge']), locationController.getAllLocations);

// Create, update, delete - only accessible by Management Admin
router.post('/', isManagementAdmin, locationController.createLocation);
router.put('/:location_id', isManagementAdmin, locationController.updateLocation);
router.delete('/:location_id', isManagementAdmin, locationController.deleteLocation);

module.exports = router;