const express = require('express');
const router = express.Router();
const {
  searchUsers,
  updateProfile,
  getUserById,
  getAllUsers,
  updateLastActive,
  uploadWallpaper,
} = require("../controllers/userController");
const { protect } = require('../models/middleware/authMiddleware');
const upload = require("../models/middleware/upload");

// Search users
router.get('/search', protect, searchUsers);

// Update profile
router.put('/update', protect, upload.single("avatar"),  updateProfile);
router.get('/:id', protect, getUserById);
router.get('/not-in/:conversationId', protect, getAllUsers);

router.post('/lastactive', protect, updateLastActive);
router.post('/wallpaper',protect ,upload.single("wallpaper"),uploadWallpaper);


module.exports = router;
