const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id,
    })
      .populate("members", "name email avatar")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name email avatar" },
      })
      .sort({ updatedAt: -1 });

    res.json(conversations);
    console.log("Conversations fetched:", conversations.length);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




const createConversation = async (req, res) => {
  try {
    const { members = [], isGroup = false, groupName = "" } = req.body;

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: "Members are required" });
    }

    // ---------- 1️⃣ One-to-one chat ----------
    if (!isGroup) {
      if (members.length !== 1) {
        return res.status(400).json({ message: "One-to-one chat requires exactly 1 member" });
      }

      const existing = await Conversation.findOne({
        isGroup: false,
        members: { $all: [req.user._id, members[0]], $size: 2 },
      })
        .populate("members", "name email avatar")
        .populate({
          path: "latestMessage",
          populate: { path: "sender", select: "name email avatar" },
        });

      if (existing) return res.json(existing);

      let conversation = await Conversation.create({
        members: [req.user._id, members[0]],
        isGroup: false,
      });

      conversation = await conversation.populate("members", "name email avatar");
      return res.status(201).json(conversation);
    }

    // ---------- 2️⃣ Group chat ----------
    if (!groupName || members.length < 2) {
      return res.status(400).json({ message: "Group chat requires name and at least 2 members" });
    }

    let conversation = await Conversation.create({
      members: [req.user._id, ...members],
      isGroup: true,
      groupName,
    });

    conversation = await conversation.populate("members", "name email avatar");
    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getConversations, createConversation };
