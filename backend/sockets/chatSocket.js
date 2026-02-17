const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

module.exports = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.user.id;

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('sendMessage', async (payload) => {
      /*
        payload = {
          conversationId,
          ciphertext,
          iv,
          media
        }
      */

      const message = await Message.create({
        conversation: payload.conversationId,
        sender: userId,
        ciphertext: payload.ciphertext,
        iv: payload.iv,
        media: payload.media || [],
      });

      await Conversation.findByIdAndUpdate(payload.conversationId, {
        latestMessage: message._id,
      });

      const populated = await message.populate('sender', 'name email avatar');

      io.to(payload.conversationId).emit('newMessage', populated);
    });

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      User.findByIdAndUpdate(userId, { lastactive: new Date() }).exec();
      
    });
  });
};
