const Request = require('../models/requestModel');

const createRequest = async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      requested_by: req.user.user_id
    };

    console.log('Creating request with data:', requestData);

    const result = await Request.create(requestData);
    
    if (!result) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create request'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in createRequest:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.findAll();
    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error in getRequestById:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

const updateRequest = async (req, res) => {
  try {
    const result = await Request.update(req.params.request_id, req.body);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    res.json({
      success: true,
      message: 'Request updated successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const result = await Request.delete(req.params.request_id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest
}; 