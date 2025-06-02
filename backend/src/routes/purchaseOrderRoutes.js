const express = require('express');
const router = express.Router();
const { 
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrder,
    deletePurchaseOrder,
    updateStatus,
    updateItemStatus,
    getApprovedPurchaseRequests,
    getAvailableVendors
} = require('../controllers/purchaseOrderController');
const { isAuthorizedRole, ROLES } = require('../middleware/authMiddleware');

// Data for Purchase Order Creation (must come before ID routes)
router.get('/data/approved-requests', isAuthorizedRole([ROLES.MANAGEMENT, ROLES.MANAGEMENT_ADMIN]), getApprovedPurchaseRequests);
router.get('/data/vendors', isAuthorizedRole([ROLES.MANAGEMENT, ROLES.MANAGEMENT_ADMIN]), getAvailableVendors);

// Purchase Order Routes
router.post('/', isAuthorizedRole([ROLES.MANAGEMENT, ROLES.MANAGEMENT_ADMIN]), createPurchaseOrder);
router.get('/', isAuthorizedRole([ROLES.MANAGEMENT, ROLES.MANAGEMENT_ADMIN, ROLES.PRINCIPAL, ROLES.HOD]), getAllPurchaseOrders);
router.get('/:id', isAuthorizedRole([ROLES.MANAGEMENT, ROLES.MANAGEMENT_ADMIN, ROLES.PRINCIPAL, ROLES.HOD]), getPurchaseOrderById);
router.put('/:id', isAuthorizedRole([ROLES.MANAGEMENT, ROLES.MANAGEMENT_ADMIN]), updatePurchaseOrder);
router.delete('/:id', isAuthorizedRole([ROLES.MANAGEMENT_ADMIN]), deletePurchaseOrder);

// Status Update Routes
router.patch('/:id/status', isAuthorizedRole([ROLES.MANAGEMENT, ROLES.MANAGEMENT_ADMIN]), updateStatus);
router.patch('/:id/items/:item_id/status', isAuthorizedRole([ROLES.MANAGEMENT, ROLES.MANAGEMENT_ADMIN]), updateItemStatus);

module.exports = router; 