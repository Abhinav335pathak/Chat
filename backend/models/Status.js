const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  type: { 
    type: String, 
    enum: ['image', 'video'],
    required: true
  },
  caption: String,
  viewedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 86400 // TTL index: auto-delete after 24 hours
  }
});

module.exports = mongoose.model('Status', statusSchema);
