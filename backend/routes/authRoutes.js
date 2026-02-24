const express = require('express');
const {
  registerUser,
  verifyEmailOtp,
  loginUser,
  getProfile
} = require('../controllers/authController');
const { protect } = require('../models/middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyEmailOtp);
router.post('/login', loginUser);
// router.get('/user', protect, getProfile);

module.exports = router;