import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

// Search users by username
export const searchUsers = async (req, res) => {
    try {
        const { username } = req.query;
        const users = await User.find({ username: { $regex: username, $options: 'i' } })
            .select('username email avatar status lastSeen');
        res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};