import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    name: {
        type: String,
        trim: true,
        maxlength: 50,
        default: 'Mizum User',
    },

    avatarUrl: {
        type: String,
        trim: true,
        default: '',
    },
    coverPhotoUrl: {
        type: String,
        trim: true,
        default: '',
    },

    phone: {
        type: String,
        trim: true,
        default: '',
    },

    bio: {
        type: String,
        trim: true,
        maxlength: 160,
        default: "Hello! Let's be friends",
    },

    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'unrevealed'],
        default: 'unrevealed',
    },

    dateOfBirth: {
        type: Date,
        default: null,
    },

    location: {
        country: { 
            type: String, 
            trim: true, 
            maxlength: 50, 
            default: ''
        },
        city: { 
            type: String, 
            trim: true, 
            maxlength: 50,
            default: '', 
        },
    },

    status: {
        type: String,
        enum: ['online', 'offline', 'busy'],
        default: 'offline',
    },

    lastSeen: {
        type: Date,
        default: Date.now,
    },

    // cài đặt người dùng
    settings: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
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
        privacy: {
            showLastSeen: { type: Boolean, default: true },
            showOnlineStatus: { type: Boolean, default: true },
        }
    },
}, { timestamps: true });

// Pre-save hook để set ảnh mặc định
profileSchema.pre('save', function (next) {
    if (!this.avatarUrl || this.avatarUrl.trim() === '') {
        switch (this.gender) {
            case 'male':
                this.avatarUrl = 'https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg';
                break;
            case 'female':
                this.avatarUrl = 'https://i.pinimg.com/736x/50/1f/04/501f04eef76531a1296714c6c9efb41d.jpg';
                break;
            default:
                this.avatarUrl = 'https://i.pinimg.com/736x/70/78/88/707888a23862a1e94597c925342cf817.jpg';
        }
    }
    if (!this.coverPhotoUrl || this.coverPhotoUrl.trim() === '') {
        this.coverPhotoUrl = 'https://i.pinimg.com/1200x/93/7a/b3/937ab38356608f4c606302b7e0bd2f07.jpg';
    }
    next();
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
