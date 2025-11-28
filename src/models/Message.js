import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    trim: true,
    default: ''
  },
  mediaUrls: [{
    url: { type: String, trim: true },
    type: { type: String, enum: ['image', 'video', 'audio', 'gif', 'file'] }
  }],
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'gif', 'sticker', 'file'],
    default: 'text',
  },
  stickerId: {
    type: String,
    default: null
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  status: {
    type: String,
    enum: ['sent', 'received', 'seen'],
    default: 'sent',
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
