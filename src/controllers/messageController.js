import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// 🟢 Gửi tin nhắn mới
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, content, mediaUrls, type, stickerId, replyTo } = req.body;

    // Kiểm tra conversation tồn tại
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Tạo message mới
    const newMessage = new Message({
      conversationId,
      sender,
      content,
      mediaUrls,
      type,
      stickerId,
      replyTo
    });

    const savedMessage = await newMessage.save();

    // Cập nhật lastMessage và lastMessageAt trong Conversation
    conversation.lastMessage = savedMessage._id;
    conversation.lastMessageAt = savedMessage.createdAt;
    await conversation.save();

    res.status(201).json({
      message: 'Message sent successfully',
      data: savedMessage
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

    const messages = await Message.find({ conversationId })
      .populate('sender', 'username email')
      .populate('replyTo')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
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
