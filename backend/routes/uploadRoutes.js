const express = require("express");
const upload = require("../models/middleware/upload");
const router = express.Router();
const Media = require("../models/Media");
const { protect } = require("../models/middleware/authMiddleware");

const getMediaType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  return "file";
};

router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const media = await Media.create({
      url: req.file.path,
      publicId: req.file.filename,
      type: getMediaType(req.file.mimetype),
      size: req.file.size,
      uploadedBy: req.user._id,
    });

    res.json({
      url: media.url,
      public_id: media.publicId,
      resource_type: media.type,
      size: media.size,
      _id: media._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
