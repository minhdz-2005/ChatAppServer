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
    },
    mediaUrl: {
        type: String,
        trim: true,
        default: null,
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'file'],
        default: 'text',
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'seen'],
        default: 'sent',
    }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);