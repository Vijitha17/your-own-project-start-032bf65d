const PurchaseRequest = require('../models/purchaseRequestModel');
const { ROLES } = require('../middleware/authMiddleware');

// Create new purchase request
const createPurchaseRequest = async (req, res) => {
    try {
        const purchaseRequestData = {
            ...req.body,
            requested_by: req.user.user_id
        };

        // Validate required fields
        if (!purchaseRequestData.approver_id) {
            return res.status(400).json({
                success: false,
                message: 'Approver ID is required'
            });
        }

        if (!purchaseRequestData.items || !Array.isArray(purchaseRequestData.items) || purchaseRequestData.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one item is required'
            });
        }

        // Validate each item
        for (const item of purchaseRequestData.items) {
            if (!item.item_name || !item.category_id || !item.quantity || !item.estimated_unit_cost) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have a name, category, quantity, and estimated unit cost'
                });
            }
        }

        const purchaseRequest = await PurchaseRequest.create(purchaseRequestData);
        if (!purchaseRequest) {
            return res.status(500).json({ 
                success: false,
                message: 'Failed to create purchase request' 
            });
        }

        res.status(201).json({ 
            success: true,
            message: 'Purchase request created successfully',
            data: purchaseRequest
        });
    } catch (error) {
        console.error('Create purchase request error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
};

// Get all purchase requests
const getAllPurchaseRequests = async (req, res) => {
    try {
        let requests;
        
        if (req.user.role === ROLES.MANAGEMENT_ADMIN || req.user.role === 'Management') {
            requests = await PurchaseRequest.findAll();
        } else {
            requests = await PurchaseRequest.findByUser(req.user.user_id);
        }

        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Get all purchase requests error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// Get purchase request by ID
const getPurchaseRequestById = async (req, res) => {
    try {
        const { purchase_request_id } = req.params;
        const request = await PurchaseRequest.findById(purchase_request_id);
        
        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: 'Purchase request not found' 
            });
        }

        // Check authorization - allow Management_Admin and Management roles to view any request
        if (req.user.role !== ROLES.MANAGEMENT_ADMIN && 
            req.user.role !== 'Management' && 
            request.requested_by !== req.user.user_id) {
            return res.status(403).json({ 
                success: false,
                message: 'Unauthorized access to this purchase request' 
            });
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Get purchase request by ID error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// Update purchase request
const updatePurchaseRequest = async (req, res) => {
    try {
        const { purchase_request_id } = req.params;
        const request = await PurchaseRequest.findById(purchase_request_id);

        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: 'Purchase request not found' 
            });
        }

        // Check authorization
        if (req.user.role !== ROLES.MANAGEMENT_ADMIN && 
            request.requested_by !== req.user.user_id) {
            return res.status(403).json({ 
                success: false,
                message: 'Unauthorized to update this purchase request' 
            });
        }

        const updated = await PurchaseRequest.update(purchase_request_id, req.body);
        res.json({ 
            success: true,
            message: 'Purchase request updated successfully' 
        });
    } catch (error) {
        console.error('Update purchase request error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// Delete purchase request
const deletePurchaseRequest = async (req, res) => {
    try {
        const { purchase_request_id } = req.params;
        const request = await PurchaseRequest.findById(purchase_request_id);

        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: 'Purchase request not found' 
            });
        }

        // Check authorization
        if (req.user.role !== ROLES.MANAGEMENT_ADMIN && 
            request.requested_by !== req.user.user_id) {
            return res.status(403).json({ 
                success: false,
                message: 'Unauthorized to delete this purchase request' 
            });
        }

        await PurchaseRequest.delete(purchase_request_id);
        res.json({ 
            success: true,
            message: 'Purchase request deleted successfully' 
        });
    } catch (error) {
        console.error('Delete purchase request error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// Add item to purchase request
const addItem = async (req, res) => {
    try {
        const { purchase_request_id } = req.params;
        const request = await PurchaseRequest.findById(purchase_request_id);

        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: 'Purchase request not found' 
            });
        }

        // Check authorization
        if (req.user.role !== ROLES.MANAGEMENT_ADMIN && 
            request.requested_by !== req.user.user_id) {
            return res.status(403).json({ 
                success: false,
                message: 'Unauthorized to modify this purchase request' 
            });
        }

        const itemId = await PurchaseRequest.addItem(purchase_request_id, req.body);
        res.status(201).json({ 
            success: true,
            message: 'Item added successfully',
            item_id: itemId 
        });
    } catch (error) {
        console.error('Add item error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// Update item in purchase request
const updateItem = async (req, res) => {
    try {
        const { purchase_request_id, item_id } = req.params;
        const request = await PurchaseRequest.findById(purchase_request_id);

        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: 'Purchase request not found' 
            });
        }

        // Check authorization
        if (req.user.role !== ROLES.MANAGEMENT_ADMIN && 
            request.requested_by !== req.user.user_id) {
            return res.status(403).json({ 
                success: false,
                message: 'Unauthorized to modify this purchase request' 
            });
        }

        const success = await PurchaseRequest.updateItem(item_id, req.body);
        if (!success) {
            return res.status(404).json({ 
                success: false,
                message: 'Item not found' 
            });
        }

        res.json({ 
            success: true,
            message: 'Item updated successfully' 
        });
    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// Delete item from purchase request
const deleteItem = async (req, res) => {
    try {
        const { purchase_request_id, item_id } = req.params;
        const request = await PurchaseRequest.findById(purchase_request_id);

        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: 'Purchase request not found' 
            });
        }

        // Check authorization
        if (req.user.role !== ROLES.MANAGEMENT_ADMIN && 
            request.requested_by !== req.user.user_id) {
            return res.status(403).json({ 
                success: false,
                message: 'Unauthorized to modify this purchase request' 
            });
        }

        const success = await PurchaseRequest.deleteItem(item_id);
        if (!success) {
            return res.status(404).json({ 
                success: false,
                message: 'Item not found' 
            });
        }

        res.json({ 
            success: true,
            message: 'Item deleted successfully' 
        });
    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// Update purchase request status
const updateStatus = async (req, res) => {
    try {
        const { purchase_request_id } = req.params;
        const { status } = req.body;

        const request = await PurchaseRequest.findById(purchase_request_id);
        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: 'Purchase request not found' 
            });
        }

        // Check if status is valid
        if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid status' 
            });
        }

        // Check if user has permission to update status
        if (![ROLES.MANAGEMENT_ADMIN, ROLES.MANAGEMENT].includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: 'Unauthorized to update purchase request status' 
            });
        }

        const success = await PurchaseRequest.updateStatus(
            purchase_request_id, 
            status, 
            req.user.user_id
        );

        res.json({ 
            success: true,
            message: 'Purchase request status updated successfully' 
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// Update item status
const updateItemStatus = async (req, res) => {
    try {
        const { purchase_request_id, item_id } = req.params;
        const { status } = req.body;

        const request = await PurchaseRequest.findById(purchase_request_id);
        if (!request) {
            return res.status(404).json({ 
                success: false,
                message: 'Purchase request not found' 
            });
        }

        // Check if user has permission to update status
        if (![ROLES.MANAGEMENT_ADMIN, ROLES.MANAGEMENT].includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: 'Unauthorized to update item status' 
            });
        }

        const success = await PurchaseRequest.updateItemStatus(item_id, status);
        if (!success) {
            return res.status(404).json({ 
                success: false,
                message: 'Item not found' 
            });
        }

        res.json({ 
            success: true,
            message: 'Item status updated successfully' 
        });
    } catch (error) {
        console.error('Update item status error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

module.exports = {
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
};
