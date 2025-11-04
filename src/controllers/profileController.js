import Profile from "../models/Profile.js";

/** 
 * Lấy thông tin profile theo userId
 */
export const getProfileByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await Profile.findOne({ userId });

        if (!profile)
            return res.status(404).json({ message: "Profile not found" });

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Tạo profile mới (chạy khi user đăng ký)
 */
export const createProfile = async (req, res) => {
    try {
        const { userId, name, gender } = req.body;

        // Kiểm tra trùng userId
        const existing = await Profile.findOne({ userId });
        if (existing)
            return res.status(400).json({ message: "Profile already exists" });

        const profile = new Profile({
            userId,
            name,
            gender,
        });

        await profile.save();
        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Cập nhật profile (tên, avatar, bio, v.v.)
 */
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProfile)
            return res.status(404).json({ message: "Profile not found" });

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Cập nhật trạng thái online/offline
 */
export const updateStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        const profile = await Profile.findOneAndUpdate(
            { userId },
            { status, lastSeen: Date.now() },
            { new: true }
        );

        if (!profile)
            return res.status(404).json({ message: "Profile not found" });

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Xóa profile (nếu user xóa tài khoản)
 */
export const deleteProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        const deleted = await Profile.findOneAndDelete({ userId });
        if (!deleted)
            return res.status(404).json({ message: "Profile not found" });

        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
