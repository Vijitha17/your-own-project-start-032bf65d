const express = require('express');
const router = express.Router();
const { 
    createCollege, 
    getAllColleges, 
    getCollegeById, 
    updateCollege, 
    deleteCollege 
} = require('../controllers/collegeController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// College routes
router.post('/', createCollege);
router.get('/', getAllColleges);
router.get('/:college_id', getCollegeById);
router.put('/:college_id', updateCollege);
router.delete('/:college_id', deleteCollege);

// Error handling middleware for college routes
router.use((err, req, res, next) => {
    console.error('College route error:', err);
    res.status(500).json({ 
        message: 'Error processing college request',
        error: err.message 
    });
});

module.exports = router; 