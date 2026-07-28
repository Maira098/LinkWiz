import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getMyProfile,
  updateProfile,
  getUserById,
  getAllUsers
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, getAllUsers);

router.get("/me", protect, getMyProfile);

router.put("/me", protect, updateProfile);

router.get("/:id", getUserById);
export default router;