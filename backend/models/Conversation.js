const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // 2+ users
  isGroup: { type: Boolean, default: false },
  groupName: { type: String, default: '' },
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
