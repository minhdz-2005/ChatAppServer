import express from 'express';
import {
  sendMessage,
  getMessagesByConversation,
  editMessage,
  deleteMessage,
  updateMessageStatus
} from '../controllers/messageController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; // dùng lại sau

const router = express.Router();

router.post('/', authMiddleware, sendMessage);
router.get('/:conversationId', authMiddleware, getMessagesByConversation);
router.put('/:messageId', authMiddleware, editMessage);
router.delete('/:messageId', authMiddleware, deleteMessage);
router.patch('/:messageId/status', authMiddleware, updateMessageStatus);

// no middleware for testing
// router.post('/', sendMessage);
// router.get('/:conversationId', getMessagesByConversation);
// router.put('/:messageId', editMessage);
// router.delete('/:messageId', deleteMessage);
// router.patch('/:messageId/status', updateMessageStatus);

export default router;
