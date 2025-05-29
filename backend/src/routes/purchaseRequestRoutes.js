const express = require('express');
const router = express.Router();
const { 
    createPurchaseRequest,
    getAllPurchaseRequests,
    getPurchaseRequestById,
    updatePurchaseRequest,
    deletePurchaseRequest,
    addItem,
    updateItem,
    deleteItem,
    updateStatus,
    updateItemStatus
} = require('../controllers/purchaseRequestController');
const { isAuthorizedRole, ROLES } = require('../middleware/authMiddleware');

// Purchase Request Routes
router.post('/', isAuthorizedRole([]), createPurchaseRequest);
router.get('/', isAuthorizedRole([]), getAllPurchaseRequests);
router.get('/:purchase_request_id', isAuthorizedRole([]), getPurchaseRequestById);
router.put('/:purchase_request_id', isAuthorizedRole([]), updatePurchaseRequest);
router.delete('/:purchase_request_id', isAuthorizedRole([]), deletePurchaseRequest);

// Item Management Routes
router.post('/:purchase_request_id/items', isAuthorizedRole([]), addItem);
router.put('/:purchase_request_id/items/:item_id', isAuthorizedRole([]), updateItem);
router.delete('/:purchase_request_id/items/:item_id', isAuthorizedRole([]), deleteItem);

// Status Management Routes (Management Admin and Management only)
router.put('/:purchase_request_id/status', 
    isAuthorizedRole([ROLES.MANAGEMENT_ADMIN, ROLES.MANAGEMENT]), 
    updateStatus
);
router.put('/:purchase_request_id/items/:item_id/status', 
    isAuthorizedRole([ROLES.MANAGEMENT_ADMIN, ROLES.MANAGEMENT]), 
    updateItemStatus
);

module.exports = router;
