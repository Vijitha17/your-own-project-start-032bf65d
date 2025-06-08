/**
 * Handles errors in a consistent way across the application
 * @param {Object} res - Express response object
 * @param {Error} error - The error object
 */
const handleError = (res, error) => {
  console.error('Error:', error);

  // Handle specific error types
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry found'
    });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist'
    });
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
};

module.exports = {
  handleError
}; 