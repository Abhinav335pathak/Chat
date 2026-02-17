const mongoose = require("mongoose");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

// 🔍 Search users by name/email
const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q
      ? {
          $or: [
            { name: { $regex: req.query.q, $options: "i" } },
            { email: { $regex: req.query.q, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.json(users);
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ message: "Failed to search users" });
  }
};


const uploadWallpaper = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wallpaper = req.file.path;

    await user.save();

    res.status(200).json({
      message: "Wallpaper uploaded successfully",
      wallpaper: user.wallpaper
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload wallpaper" });
  }
};





const getAllUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    const uid = new mongoose.Types.ObjectId(userId);

    // Get all users who are already in conversation with this user
    const connectedUserIds = await Conversation.distinct("members", {
      isGroup: false,
      members: uid,
    });

    // Remove self
    const filteredIds = connectedUserIds.filter(id => !id.equals(uid));

    // Get users NOT in conversation
    const users = await User.find({
      _id: { $nin: [...filteredIds, uid] },
    }).select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




// 👤 Get user by ID (from auth token)
const getUserById = async (req, res) => {
  try {
    

    const user = await User.findById(req.user.id).select("+avatar -password +wallpaper");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};


// 🟢 Update last active timestamp
const updateLastActive = async (userId) => {
  if (!userId) return;
  try {
    await User.findByIdAndUpdate(userId, { lastActive: new Date() });
    console.log("Updated last active for user:", userId);
  } catch (err) {
    console.error("Last active update failed:", err.message);
  }
};

// ✏️ Update profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.file) {
      user.avatar = req.file.path; 
    }

    await user.save();

    res.json(user);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


module.exports = {
  searchUsers,
  updateProfile,
  getAllUsers,
  getUserById,
  updateLastActive,
  uploadWallpaper,
};

