const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔐 Optional text
    ciphertext: { type: String },
    iv: { type: String },

    // 📎 Optional media
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],

    // 👁 Read receipts
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
