const PurchaseOrder = require('../models/purchaseOrderModel');
const { ROLES } = require('../middleware/authMiddleware');

// Create new purchase order
const createPurchaseOrder = async (req, res) => {
    try {
        const { purchase_request_id, vendor_id, order_date, expected_delivery_date, payment_terms, shipping_method, notes } = req.body;

        // Validate required fields
        if (!purchase_request_id) {
            return res.status(400).json({
                success: false,
                message: 'Purchase request ID is required'
            });
        }

        if (!vendor_id) {
            return res.status(400).json({
                success: false,
                message: 'Vendor ID is required'
            });
        }

        if (!order_date) {
            return res.status(400).json({
                success: false,
                message: 'Order date is required'
            });
        }

        const purchaseOrderData = {
            purchase_request_id,
            vendor_id,
            order_date,
            expected_delivery_date,
            payment_terms,
            shipping_method,
            notes,
            ordered_by: req.user.user_id
        };

        const purchaseOrder = await PurchaseOrder.create(purchaseOrderData);
        if (!purchaseOrder) {
            return res.status(500).json({ 
                success: false,
                message: 'Failed to create purchase order' 
            });
        }

        res.status(201).json({ 
            success: true,
            message: 'Purchase order created successfully',
            data: purchaseOrder
        });
    } catch (error) {
        console.error('Create purchase order error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
};

// Get all purchase orders
const getAllPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrder.findAll();
        res.json({
            success: true,
            data: purchaseOrders
        });
    } catch (error) {
        console.error('Get all purchase orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// Get purchase order by ID
const getPurchaseOrderById = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findById(req.params.id);
        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.json({
            success: true,
            data: purchaseOrder
        });
    } catch (error) {
        console.error('Get purchase order error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// Update purchase order
const updatePurchaseOrder = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.update(req.params.id, req.body);
        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.json({
            success: true,
            message: 'Purchase order updated successfully',
            data: purchaseOrder
        });
    } catch (error) {
        console.error('Update purchase order error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// Delete purchase order
const deletePurchaseOrder = async (req, res) => {
    try {
        const deleted = await PurchaseOrder.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.json({
            success: true,
            message: 'Purchase order deleted successfully'
        });
    } catch (error) {
        console.error('Delete purchase order error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// Update purchase order status
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const purchaseOrder = await PurchaseOrder.update(req.params.id, { order_status: status });
        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.json({
            success: true,
            message: 'Purchase order status updated successfully',
            data: purchaseOrder
        });
    } catch (error) {
        console.error('Update purchase order status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// Update purchase order item status
const updateItemStatus = async (req, res) => {
    try {
        const { item_id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const purchaseOrder = await PurchaseOrder.update(req.params.id, {
            items: [{
                purchaseorder_item_id: item_id,
                item_status: status
            }]
        });

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        res.json({
            success: true,
            message: 'Purchase order item status updated successfully',
            data: purchaseOrder
        });
    } catch (error) {
        console.error('Update purchase order item status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// Get approved purchase requests for creating purchase orders
const getApprovedPurchaseRequests = async (req, res) => {
    try {
        const requests = await PurchaseOrder.getApprovedPurchaseRequests();
        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Get approved purchase requests error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

// Get available vendors
const getAvailableVendors = async (req, res) => {
    try {
        const vendors = await PurchaseOrder.getAvailableVendors();
        res.json({
            success: true,
            data: vendors
        });
    } catch (error) {
        console.error('Get available vendors error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

module.exports = {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrder,
    deletePurchaseOrder,
    updateStatus,
    updateItemStatus,
    getApprovedPurchaseRequests,
    getAvailableVendors
}; 