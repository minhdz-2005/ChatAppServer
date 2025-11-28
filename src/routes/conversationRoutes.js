import express from "express";
import {
  createConversation,
  getUserConversations,
  getConversationById,
  updateLastMessage,
  deleteConversation,
} from "../controllers/conversationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // middleware xác thực JWT

const router = express.Router();

router.post("/", authMiddleware, createConversation);
router.get("/", authMiddleware, getUserConversations);
router.get("/:id", authMiddleware, getConversationById);
router.put("/:id/last-message", authMiddleware, updateLastMessage);
router.delete("/:id", authMiddleware, deleteConversation);

// no middleware for testing
// router.post("/", createConversation);
// router.get("/", getUserConversations);
// router.get("/:id", getConversationById);
// router.put("/:id/last-message", updateLastMessage);
// router.delete("/:id", deleteConversation);

export default router;
