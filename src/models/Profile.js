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
                this.avatarUrl = '/images/default_male.png';
                break;
            case 'female':
                this.avatarUrl = '/images/default_female.png';
                break;
            default:
                this.avatarUrl = '/images/default_avatar.png';
        }
    }
    next();
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
