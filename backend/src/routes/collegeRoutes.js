const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');
const { isManagementAdmin } = require('../middleware/authMiddleware');

// Apply authentication middleware to all college routes
router.use(isManagementAdmin);

// College CRUD Routes
router.post('/', collegeController.createCollege);
router.get('/', collegeController.getAllColleges);
router.get('/:college_id', collegeController.getCollegeById);
router.put('/:college_id', collegeController.updateCollege);
router.delete('/:college_id', collegeController.deleteCollege);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'College routes are working' });
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('College route error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

module.exports = router;