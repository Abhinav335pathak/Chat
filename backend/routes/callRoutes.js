// routes/callRoutes.js
const express = require("express");
const router = express.Router();
const {
  initiateCall,
  acceptCall,
  rejectCall,
  endCall,
  getCallHistory
} = require("../controllers/callController");
const { protect } = require("../models/middleware/authMiddleware");

// Apply authentication middleware to all routes
router.use(protect);

router.post("/initiate", initiateCall);
router.post("/accept", acceptCall);
router.post("/reject", rejectCall);
router.post("/end", endCall);
router.get("/history/:conversationId", getCallHistory);

module.exports = router;