import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// 🟢 Gửi tin nhắn mới
export const sendMessage = async (req, res) => {
  try {
    const {
      conversationId,
      sender,
      content,
      mediaUrls,
      type,
      stickerId,
      replyTo
    } = req.body;

    const io = req.app.get('io');

    // 1️⃣ Kiểm tra conversation tồn tại
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // 2️⃣ Tạo message mới (mặc định là sent)
    const newMessage = new Message({
      conversationId,
      sender,
      content,
      mediaUrls,
      type,
      stickerId,
      replyTo,
      status: 'sent'
    });

    const savedMessage = await newMessage.save();

    // 3️⃣ Kiểm tra người nhận có đang ở trong room không
    const room = io.sockets.adapter.rooms.get(conversationId);

    let isReceiverInRoom = false;

    if (room) {
      for (const socketId of room) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket?.userId && socket.userId.toString() !== sender.toString()) {
          isReceiverInRoom = true;
          break;
        }
      }
    }

    // 4️⃣ Nếu người nhận đang mở conversation → SEEN ngay
    if (isReceiverInRoom) {
      savedMessage.status = 'seen';
      await savedMessage.save();
    }

    // 5️⃣ Populate message
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'username _id')
      .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'username avatar _id' }
      });

    // 6️⃣ Update conversation metadata
    conversation.lastMessage = savedMessage._id;
    conversation.lastMessageAt = savedMessage.createdAt;
    await conversation.save();

    // 7️⃣ Emit message cho room
    io.to(conversationId).emit('newMessage', populatedMessage);

    // 8️⃣ Nếu message đã seen → notify sender
    if (savedMessage.status === 'seen') {
      io.to(conversationId).emit('messagesSeen', {
        conversationId,
        userId: sender
      });
    }

    return res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// 🟡 Lấy tất cả tin nhắn trong 1 cuộc trò chuyện
export const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 20, before } = req.query;

    const query = { conversationId };

    // Nếu có cursor (load tin cũ)
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate("sender", "username email avatar")
      .populate("replyTo")
      .sort({ createdAt: -1 }) // lấy mới nhất trước
      .limit(Number(limit));

    // Đảo ngược lại để hiển thị đúng thứ tự
    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟠 Chỉnh sửa tin nhắn
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.content = content;
    message.isEdited = true;
    await message.save();

    res.status(200).json({ message: 'Message updated successfully', data: message });
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔵 Xóa tin nhắn (mềm)
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.deletedAt = new Date();
    await message.save();

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🟣 Cập nhật trạng thái tin nhắn (sent → received → seen)
export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    if (!['sent', 'received', 'seen'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    if (!message) return res.status(404).json({ message: 'Message not found' });

    res.status(200).json({ message: 'Status updated successfully', data: message });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
