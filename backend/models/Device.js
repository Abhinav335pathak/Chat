const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: String, required: true },
  deviceType: { type: String, enum: ['desktop', 'mobile', 'tablet'], default: 'mobile' },
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
