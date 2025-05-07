const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authMiddleware, isManagementAdmin } = require('../middleware/authMiddleware');

router.use(authMiddleware());

router.get('/', locationController.getAllLocations);
router.get('/:location_id', locationController.getLocationById);
router.get('/college/:college_id', locationController.getLocationsByCollege);
router.get('/department/:department_id', locationController.getLocationsByDepartment);

router.post('/', isManagementAdmin, locationController.createLocation);
router.put('/:location_id', isManagementAdmin, locationController.updateLocation);
router.delete('/:location_id', isManagementAdmin, locationController.deleteLocation);

module.exports = router;