const cloudinary = require('../config/cloudinary');
const Status = require('../models/Status');
const Conversation = require('../models/Conversation');

// Upload status
const uploadStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // CloudinaryStorage already uploaded the file
    // req.file.path = secure_url, req.file.filename = public_id
    const mediaUrl = req.file.path;
    const publicId = req.file.filename;

    // Determine file type from mime type
    const mimeType = req.file.mimetype;
    let fileType = 'image';
    if (mimeType.startsWith('video')) {
      fileType = 'video';
    }

    const status = await Status.create({
      user: userId,
      mediaUrl,
      publicId,
      type: fileType,
      caption: caption || ''
    });

    await status.populate('user', 'username avatar');

    res.status(201).json({
      message: 'Status uploaded successfully',
      status
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to upload status',
      error: error.message
    });
  }
};

// Get statuses from users in conversations
const getStatuses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all conversations where the current user is a member
    const conversations = await Conversation.find({
      members: userId
    }).populate('members', 'username avatar _id');

    // Extract all unique user IDs from conversations (excluding current user)
    const conversationUserIds = new Set();
    conversations.forEach(conv => {
      conv.members.forEach(member => {
        if (member._id.toString() !== userId.toString()) {
          conversationUserIds.add(member._id);
        }
      });
    });

    // Fetch active statuses (uploaded in last 24 hours) from those users
    const activeStatuses = await Status.find({
      user: { $in: Array.from(conversationUserIds) },
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).populate('user', 'username avatar _id').sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Statuses fetched successfully',
      statuses: activeStatuses
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch statuses',
      error: error.message
    });
  }
};

// Get all statuses
const getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.find()
      .populate('user', 'username avatar _id')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'All statuses fetched',
      statuses
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch statuses',
      error: error.message
    });
  }
};

// Get user's own statuses
const getUserStatuses = async (req, res) => {
  try {
    const userId = req.user._id;

    const statuses = await Status.find({ user: userId })
      .populate('user', 'username avatar _id')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'User statuses fetched',
      statuses
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch statuses',
      error: error.message
    });
  }
};

// Mark status as viewed
const markStatusViewed = async (req, res) => {
  try {
    const { statusId } = req.params;
    const userId = req.user._id;

    const status = await Status.findById(statusId);
    if (!status) {
      return res.status(404).json({ message: 'Status not found' });
    }

    // Add user to viewedBy if not already there
    if (!status.viewedBy.includes(userId)) {
      status.viewedBy.push(userId);
      await status.save();
    }

    res.status(200).json({
      message: 'Status marked as viewed',
      status
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to mark status as viewed',
      error: error.message
    });
  }
};

// Delete status
const deleteStatus = async (req, res) => {
  try {
    const { statusId } = req.params;
    const userId = req.user._id;

    const status = await Status.findById(statusId);
    if (!status) {
      return res.status(404).json({ message: 'Status not found' });
    }

    // Only allow user who uploaded to delete
    if (status.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this status' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(status.publicId, {
      resource_type: status.type
    });

    // Delete from DB
    await Status.findByIdAndDelete(statusId);

    res.status(200).json({
      message: 'Status deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete status',
      error: error.message
    });
  }
};

module.exports = {
  uploadStatus,
  getStatuses,
  getAllStatuses,
  getUserStatuses,
  markStatusViewed,
  deleteStatus
};
