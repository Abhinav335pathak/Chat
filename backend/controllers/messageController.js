const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Media = require('../models/Media');
const cloudinary = require('../config/cloudinary');
const upload = require("../models/middleware/upload");


const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email avatar')
      .populate('media')
      .sort({ createdAt: 1 });

    res.json(messages); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const sendMessage = async (req, res) => {
  try {

    const { conversationId } = req.params;
    const { ciphertext, iv } = req.body;

    const files = req.files || []; 


    
    if (!ciphertext && files.length === 0) {
      return res.status(400).json({ message: "Cannot send an empty message" });
    }
    let mediaIds = [];

    if(files.length >0 ){
      const getMediaType = (mimetype) => {
        if (mimetype.startsWith("image/")) return "image";
        if (mimetype.startsWith("video/")) return "video";
        if (mimetype.startsWith("audio/")) return "audio";
        return "file";
      };
      // load the conversation to set uploadedTo
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      const mediaPromises = files.map((file) =>
        Media.create({
          url: file.path,
          publicId: file.filename,
          type: getMediaType(file.mimetype),
          uploadedBy: req.user._id,
          uploadedTo: conversation._id,
          size: file.size,
        })
      );
    

        const savedMediaItems = await Promise.all(mediaPromises);
      mediaIds = savedMediaItems.map((item) => item._id);
    }


  

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      ciphertext: ciphertext || null,
      iv: iv || null,
     media: mediaIds.length > 0 ? mediaIds : undefined,
    });

    const populated = await message.populate([
      { path: 'sender', select: 'name email avatar' },
      { path: 'media' }
    ]);


    await Conversation.findByIdAndUpdate(conversationId, { latestMessage: message._id });

    res.status(201).json(populated);

  }
  catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



 const deleteMessages = async (req, res) => {
  try {
    const { messageIds } = req.body;

    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({ message: "Invalid message IDs" });
    }
    const messages = await Message.find({
      _id: { $in: messageIds },
    });

    const publicIds = [];
    const mediaIds = [];

    messages.forEach((msg) => {
      msg.media?.forEach((item) => {
        if (item.publicId) {
          publicIds.push(item.publicId);
        }
        mediaIds.push(item._id);
      });
    });

    // Delete from Cloudinary (if any media exists)
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }

    // Delete media documents from DB
    if (mediaIds.length > 0) {
      await Media.deleteMany({
        _id: { $in: mediaIds },
      });
    }

    // Delete messages from DB
    await Message.deleteMany({
      _id: { $in: messageIds },
    });

    res.json({ message: "Messages deleted successfully" });
  } catch (err) {
    console.error("Delete messages error:", err);
    res.status(500).json({ message: "Failed to delete messages" });
  }
};


module.exports = {
  getMessages,
  sendMessage,
  deleteMessages
};
