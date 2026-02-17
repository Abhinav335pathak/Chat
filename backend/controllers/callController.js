// controllers/callController.js
const Call = require("../models/call");
const User = require("../models/User");

// Initiate a call
const initiateCall = async (req, res) => {
  try {
    const { conversationId, receiverId, callType } = req.body;
    const callerId = req.user._id;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Create call record
    const call = new Call({
      conversationId,
      caller: callerId,
      receiver: receiverId,
      callType,
      status: "ringing"
    });

    await call.save();

    // Populate caller and receiver details
    await call.populate("caller", "name email avatar");
    await call.populate("receiver", "name email avatar");

    res.status(201).json({
      message: "Call initiated",
      call
    });

    // Emit call event to receiver via Socket.IO
    req.io.to(receiverId.toString()).emit("incoming-call", {
      callId: call._id,
      caller: call.caller,
      callType,
      conversationId
    });

  } catch (error) {
    res.status(500).json({ message: "Error initiating call", error: error.message });
  }
};

// Accept a call
const acceptCall = async (req, res) => {
  try {
    const { callId } = req.body;
    const userId = req.user._id;

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    // Check if user is the receiver
    if (call.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to accept this call" });
    }

    call.status = "accepted";
    call.startedAt = new Date();
    await call.save();

    res.json({ message: "Call accepted", call });

    // Notify caller that call was accepted
    req.io.to(call.caller.toString()).emit("call-accepted", {
      callId: call._id
    });

  } catch (error) {
    res.status(500).json({ message: "Error accepting call", error: error.message });
  }
};

// Reject a call
const rejectCall = async (req, res) => {
  try {
    const { callId } = req.body;
    const userId = req.user._id;

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    // Check if user is the receiver
    if (call.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to reject this call" });
    }

    call.status = "rejected";
    call.endedAt = new Date();
    await call.save();

    res.json({ message: "Call rejected", call });

    // Notify caller that call was rejected
    req.io.to(call.caller.toString()).emit("call-rejected", {
      callId: call._id
    });

  } catch (error) {
    res.status(500).json({ message: "Error rejecting call", error: error.message });
  }
};

// End a call
const endCall = async (req, res) => {
  try {
    const { callId } = req.body;
    const userId = req.user._id;

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    // Check if user is either caller or receiver
    if (call.caller.toString() !== userId.toString() && call.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to end this call" });
    }

    call.status = "ended";
    call.endedAt = new Date();
    
    // Calculate call duration if call was accepted
    if (call.startedAt) {
      call.duration = Math.floor((call.endedAt - call.startedAt) / 1000);
    }

    await call.save();

    res.json({ message: "Call ended", call });

    // Notify the other participant
    const otherUserId = call.caller.toString() === userId.toString() 
      ? call.receiver.toString() 
      : call.caller.toString();

    req.io.to(otherUserId).emit("call-ended", {
      callId: call._id
    });

  } catch (error) {
    res.status(500).json({ message: "Error ending call", error: error.message });
  }
};

// Get call history for a conversation
const getCallHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const calls = await Call.find({ conversationId })
      .populate("caller", "name avatar")
      .populate("receiver", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Call.countDocuments({ conversationId });

    res.json({
      calls,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCalls: total
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching call history", error: error.message });
  }
};

module.exports = {
  initiateCall,
  acceptCall,
  rejectCall,
  endCall,
  getCallHistory
};