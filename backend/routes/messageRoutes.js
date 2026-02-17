const express = require('express');
const router = express.Router();
const { getMessages, sendMessage,deleteMessages } = require('../controllers/messageController');
const { protect } = require('../models/middleware/authMiddleware');
const upload = require("../models/middleware/upload");


// Get messages for a conversation
router.get('/:conversationId', protect, getMessages);

// Send a new message
router.delete('/delete' ,protect ,deleteMessages);

router.post("/:conversationId", protect,  upload.array("files", 10), sendMessage);

module.exports = router;
