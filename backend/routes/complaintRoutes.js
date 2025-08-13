
const express = require('express');
const { getComplaints, addComplaint, updateComplaint, deleteComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getComplaints);
router.post('/', protect, addComplaint);
router.put('/:id', protect, updateComplaint);
router.delete('/:id', protect, deleteComplaint);

module.exports = router;

// change file path and change names of functions have different http methods

// getComplaints, addComplaint, updateComplaint, deleteComplaint

// find path for router.get in green- look at 