import express from "express";
import {
    getProfileByUserId,
    createProfile,
    updateProfile,
    updateStatus,
    deleteProfile,
} from "../controllers/profileController.js";

const router = express.Router();

// Lấy thông tin profile
router.get("/:userId", getProfileByUserId);

// Tạo profile mới
router.post("/", createProfile);

// Cập nhật profile
router.put("/:userId", updateProfile);

// Cập nhật trạng thái online/offline
router.patch("/:userId/status", updateStatus);

// Xóa profile
router.delete("/:userId", deleteProfile);

export default router;
