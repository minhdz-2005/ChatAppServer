import { searchUsers } from "../controllers/userController.js";

import express from "express";
const router = express.Router();

// Search users by username
router.get("/search", searchUsers);

export default router;