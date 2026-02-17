const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },       // Cloudinary URL
  publicId: { type: String, required: true },  // Cloudinary public ID
  type: { type: String, enum: ['image', 'video', 'audio', 'file'], required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  size: { type: Number },                      // size in bytes
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
