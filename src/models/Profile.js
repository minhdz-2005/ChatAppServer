import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
        required: true,
        unique: true,
    },
    avatarUrl: {
        type: String,
        default: '',
        trim: true,
    },
    coverPhotoUrl: {
        type: String,
        default: '',
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        default: 'Hello! Let\'s be friends',
        maxlength: 160,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'unrevealed'],
        default: 'unrevealed',
    },
    location: {
        country: String,
        city: String,
        trim: true,
        maxlength: 50,
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'away', 'busy'],
        default: 'offline',
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    }, 
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    friendRequests: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        }
    }],
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    settings: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light',
        },
        language: {
            type: String,
            enum: ['vi', 'en', 'jp', 'cn'],
            default: 'en',
        },
        notifications: {
            type: Boolean,
            default: true,
        },
    },
}, { timestamps: true });

// Pre-save hook to set default avatar
profileSchema.pre('save', function(next) {
    if (!this.avatarUrl || this.avatarUrl.trim() === '') {
        if (this.gender === 'male') {
            this.avatarUrl = '';
        }
        else if (this.gender === 'female') {
            this.avatarUrl = '';
        }
        else {
            this.avatarUrl = '';
        }
    }
    next();
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;