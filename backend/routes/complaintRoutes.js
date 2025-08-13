const express = require('express');
const router = express.Router();

const {
  getComplaints,
  addComplaint,
  updateComplaint,
  deleteComplaint,
  getMyComplaints
} = require('../controllers/complaintController');

const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');

router.get('/my', protect, getMyComplaints);
router.get('/', protect, requireRole('staff'), getComplaints);
router.post('/', protect, addComplaint);
router.put('/:id', protect, requireRole('staff'), updateComplaint);
router.delete('/:id', protect, requireRole('staff'), deleteComplaint);

module.exports = router;