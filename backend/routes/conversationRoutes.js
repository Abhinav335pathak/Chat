const express = require('express');
const router = express.Router();
const { getConversations, createConversation } = require('../controllers/conversationController');
const { protect } = require('../models/middleware/authMiddleware');

// Get all conversations
router.get('/', protect, getConversations);

// Create a conversation
router.post('/', protect, createConversation);

module.exports = router;
