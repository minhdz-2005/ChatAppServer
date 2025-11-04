import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
  blockUser,
  unblockUser,
  getRelationshipStatus,
} from "../controllers/relationshipController.js";

const router = express.Router();

// Gửi lời mời kết bạn
router.post("/request", sendFriendRequest);

// Chấp nhận lời mời
router.post("/accept", acceptFriendRequest);

// Từ chối hoặc hủy lời mời
router.post("/reject", rejectFriendRequest);

// Hủy kết bạn
router.post("/unfriend", unfriend);

// Chặn người dùng
router.post("/block", blockUser);

// Bỏ chặn
router.post("/unblock", unblockUser);

// Lấy trạng thái mối quan hệ giữa 2 user
router.get("/:userId1/:userId2", getRelationshipStatus);

export default router;
