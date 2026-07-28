import express from "express";
import { protect } from "../middleware/auth.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getMessages);

export default router;