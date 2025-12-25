import Conversation from "../models/Conversation.js";

/**
 * @desc Tạo cuộc trò chuyện mới (1-1 hoặc group)
 * @route POST /api/conversations
 * @access Private
 */
export const createConversation = async (req, res) => {
  try {
    const { participants, isGroup, name } = req.body;
    const userId = req.user?._id; // giả sử bạn đã có middleware auth để gắn user vào req

    // Kiểm tra dữ liệu
    if (!participants || participants.length < 2) {
      return res.status(400).json({ message: "Cần ít nhất 2 người tham gia." });
    }

    // Nếu là chat 1-1, kiểm tra xem đã tồn tại chưa
    if (!isGroup) {
      const existing = await Conversation.findOne({
        isGroup: false,
        participants: { $all: participants, $size: 2 },
      })
        .populate("participants", "username email avatar") // populate thông tin người tham gia
        .populate("lastMessage");

      if (existing) {
        return res.status(200).json(existing);
      }
    }

    const newConversation = new Conversation({
      participants,
      isGroup,
      name: isGroup ? name : null,
      createdBy: userId,
    });

    const saved = await newConversation.save();
    const populatedConversation = await Conversation.findById(saved._id)
      .populate("participants", "username email avatar")
      .populate("lastMessage");

    res.status(201).json(populatedConversation);
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Lấy tất cả conversation của user hiện tại
 * @route GET /api/conversations
 * @access Private
 */
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user?.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "username email avatar") // populate thông tin người tham gia
      .populate("lastMessage") // lấy tin nhắn cuối
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    console.error("Error getting conversations:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Lấy chi tiết 1 conversation theo ID
 * @route GET /api/conversations/:id
 * @access Private
 */
export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id)
      .populate("participants", "username email avatar")
      .populate("lastMessage");

    if (!conversation) {
      return res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
    }

    res.status(200).json(conversation);
  } catch (err) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Cập nhật tin nhắn cuối cùng
 * @route PUT /api/conversations/:id/last-message
 * @access Private
 */
export const updateLastMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { messageId } = req.body;

    const updated = await Conversation.findByIdAndUpdate(
      id,
      { lastMessage: messageId, lastMessageAt: Date.now() },
      { new: true }
    ).populate("lastMessage");

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy conversation" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating last message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Xoá conversation (tuỳ chọn)
 * @route DELETE /api/conversations/:id
 * @access Private
 */
export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Conversation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy conversation" });
    }

    res.status(200).json({ message: "Đã xoá cuộc trò chuyện" });
  } catch (err) {
    console.error("Error deleting conversation:", err);
    res.status(500).json({ message: "Server error" });
  }
};
