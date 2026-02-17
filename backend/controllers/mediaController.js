const cloudinary = require('../config/cloudinary');
const Media = require('../models/Media');
const streamifier = require("streamifier");


const getMedia = async (req, res) => {
  try {
    const userId = req.user._id;

    const media = await Media.find({
      $or: [
        { uploadedBy: userId },  // sent
        { uploadedTo: userId }   // received
      ]
    }).sort({ createdAt: -1 });

    if (!media.length) {
      return res.status(404).json({ message: "No media found" });
    }

    res.status(200).json({
      message: "Media fetched successfully",
      media
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch media",
      error: error.message
    });
  }
};



// Delete media
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'No id provided' });
    }

    // Support single id or comma-separated ids
    const ids = Array.isArray(id) ? id : (String(id).includes(',') ? String(id).split(',') : [id]);

    const medias = await Media.find({ _id: { $in: ids } });

    if (!medias.length) {
      return res.status(404).json({ message: 'No media found' });
    }

    const cloudinaryDeletions = medias.map(item => {
      const resource_type = item.type === 'video' ? 'video' : (item.type === 'audio' || item.type === 'file' ? 'raw' : 'image');
      return cloudinary.uploader.destroy(item.publicId, { resource_type });
    });

    await Promise.all(cloudinaryDeletions);

    await Media.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      message: `${medias.length} item(s) deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete media',
      error: error.message
    });
  }
};

module.exports={
 getMedia,
  deleteMedia
}