import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null,
    },
    isGroup: {
        type: Boolean,
        default: false,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        default: null,
        required: function() { return this.isGroup; },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    lastMessageAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);