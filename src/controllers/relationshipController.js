import Relationship from "../models/Relationship.js";

/**
 * Helper: Tìm hoặc tạo mối quan hệ giữa 2 user
 */
const findOrCreateRelationship = async (userId1, userId2) => {
  // đảm bảo user1 < user2 để trùng khớp với pre-validate trong model
  const [u1, u2] = userId1.toString() < userId2.toString()
    ? [userId1, userId2]
    : [userId2, userId1];

  let relationship = await Relationship.findOne({ user1: u1, user2: u2 });

  if (!relationship) {
    relationship = new Relationship({
      user1: u1,
      user2: u2,
      type: "none",
    });
  }

  return relationship;
};

/**
 * Gửi lời mời kết bạn
 */
export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (senderId === receiverId)
      return res.status(400).json({ message: "Cannot friend yourself" });

    const relationship = await findOrCreateRelationship(senderId, receiverId);

    if (relationship.type === "friend")
      return res.status(400).json({ message: "Already friends" });

    if (relationship.type === "pending")
      return res.status(400).json({ message: "Request already pending" });

    if (relationship.type === "blocked")
      return res.status(400).json({ message: "Cannot send request (blocked)" });

    relationship.type = "pending";
    relationship.requester = senderId;
    relationship.blocker = null;

    await relationship.save();

    // emit socket event ở đây nếu dùng socket.io (ví dụ: to(receiverId).emit("friendRequestReceived", {...}))

    res.status(200).json({ message: "Friend request sent", relationship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Chấp nhận lời mời kết bạn
 */
export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    const relationship = await findOrCreateRelationship(userId1, userId2);

    if (relationship.type !== "pending")
      return res.status(400).json({ message: "No pending request to accept" });

    // chỉ người nhận mới được chấp nhận
    if (relationship.requester.toString() === userId1.toString())
      return res.status(403).json({ message: "Requester cannot accept their own request" });

    relationship.type = "friend";
    relationship.requester = null;

    await relationship.save();

    // emit socket event ("friendAccepted")

    res.status(200).json({ message: "Friend request accepted", relationship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Từ chối hoặc hủy lời mời kết bạn
 */
export const rejectFriendRequest = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    const relationship = await findOrCreateRelationship(userId1, userId2);

    if (relationship.type !== "pending")
      return res.status(400).json({ message: "No pending request to reject" });

    relationship.type = "none";
    relationship.requester = null;

    await relationship.save();

    res.status(200).json({ message: "Friend request rejected", relationship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Hủy kết bạn
 */
export const unfriend = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    const relationship = await findOrCreateRelationship(userId1, userId2);

    if (relationship.type !== "friend")
      return res.status(400).json({ message: "Users are not friends" });

    relationship.type = "none";
    relationship.requester = null;
    relationship.blocker = null;

    await relationship.save();

    res.status(200).json({ message: "Unfriended successfully", relationship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Chặn người dùng
 */
export const blockUser = async (req, res) => {
  try {
    const { blockerId, blockedId } = req.body;
    const relationship = await findOrCreateRelationship(blockerId, blockedId);

    relationship.type = "blocked";
    relationship.blocker = blockerId;
    relationship.requester = null;

    await relationship.save();

    res.status(200).json({ message: "User blocked successfully", relationship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Bỏ chặn người dùng
 */
export const unblockUser = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    const relationship = await findOrCreateRelationship(userId1, userId2);

    if (relationship.type !== "blocked")
      return res.status(400).json({ message: "Users are not blocked" });

    relationship.type = "none";
    relationship.blocker = null;

    await relationship.save();

    res.status(200).json({ message: "User unblocked successfully", relationship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Lấy trạng thái mối quan hệ giữa 2 user
 */
export const getRelationshipStatus = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const relationship = await Relationship.findOne({
      $or: [
        { user1: userId1, user2: userId2 },
        { user1: userId2, user2: userId1 },
      ],
    });

    if (!relationship)
      return res.status(200).json({ type: "none" });

    res.status(200).json(relationship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
