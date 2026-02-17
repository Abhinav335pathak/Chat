const express = require('express');
const router = express.Router();
const { protect } = require('../models/middleware/authMiddleware');
const upload = require('../models/middleware/upload');
const {
  uploadStatus,
  getStatuses,
  getAllStatuses,
  getUserStatuses,
  markStatusViewed,
  deleteStatus
} = require('../controllers/statusController');

// Upload a new status
router.post('/upload', protect, upload.single('media'), uploadStatus);

// Get statuses from users in conversations
router.get('/feed', protect, getStatuses);

// Get all statuses (admin or public)
router.get('/all', protect, getAllStatuses);

// Get current user's statuses
router.get('/my', protect, getUserStatuses);

// Mark status as viewed
router.put('/:statusId/view', protect, markStatusViewed);

// Delete status
router.delete('/:statusId', protect, deleteStatus);

module.exports = router;
