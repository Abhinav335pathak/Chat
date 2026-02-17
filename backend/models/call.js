// models/Call.js
const mongoose = require("mongoose");

const callSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
  caller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  callType: { type: String, enum: ["audio", "video"], required: true },
  status: { type: String, enum: ["ringing", "accepted", "rejected", "ended", "missed"], default: "ringing" },
  startedAt: Date,
  endedAt: Date,
  duration: Number, // in seconds
  signalData: mongoose.Schema.Types.Mixed // For WebRTC signaling
}, { timestamps: true });

module.exports = mongoose.model("Call", callSchema);