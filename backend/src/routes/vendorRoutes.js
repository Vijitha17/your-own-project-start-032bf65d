const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { authMiddleware, ROLES } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware());

// Get all vendors
router.get('/', vendorController.getAllVendors);

// Search vendors
router.get('/search', vendorController.searchVendors);

// Get vendor by ID
router.get('/:id', vendorController.getVendorById);

// Create new vendor (only for admin and management)
router.post('/', 
    authMiddleware([ROLES.MANAGEMENT_ADMIN, ROLES.MANAGEMENT]),
    vendorController.createVendor
);

// Update vendor (only for admin and management)
router.put('/:id',
    authMiddleware([ROLES.MANAGEMENT_ADMIN, ROLES.MANAGEMENT]),
    vendorController.updateVendor
);

// Delete vendor (only for admin)
router.delete('/:id',
    authMiddleware([ROLES.MANAGEMENT_ADMIN]),
    vendorController.deleteVendor
);

module.exports = router; 