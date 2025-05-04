const Vendor = require('../models/vendorModel');
const { Op } = require('sequelize');
const pool = require('../config/database');

// Helper function to generate vendor ID
const generateVendorId = async () => {
    try {
        const [latestVendor] = await pool.query(
            'SELECT vendor_id FROM Vendors ORDER BY vendor_id DESC LIMIT 1'
        );

        let newId = 'VID001';
        if (latestVendor && latestVendor.length > 0) {
            const lastNumber = parseInt(latestVendor[0].vendor_id.replace('VID', ''));
            newId = `VID${String(lastNumber + 1).padStart(3, '0')}`;
        }

        return newId;
    } catch (error) {
        console.error('Error generating vendor ID:', error);
        throw error;
    }
};

// Create a new vendor
exports.createVendor = async (req, res) => {
    try {
        const vendorId = await generateVendorId();
        const vendorData = {
            vendor_id: vendorId,
            ...req.body
        };
        await Vendor.create(vendorData);
        res.status(201).json({
            success: true,
            data: vendorData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all vendors
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.findAll();
        res.status(200).json({
            success: true,
            data: vendors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }
        res.status(200).json({
            success: true,
            data: vendor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update vendor
exports.updateVendor = async (req, res) => {
    try {
        const updated = await Vendor.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }
        const vendor = await Vendor.findById(req.params.id);
        res.status(200).json({
            success: true,
            data: vendor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
    try {
        const deleted = await Vendor.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Vendor deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search vendors
exports.searchVendors = async (req, res) => {
    try {
        const { query } = req.query;
        const vendors = await Vendor.search(query);
        res.status(200).json({
            success: true,
            data: vendors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 