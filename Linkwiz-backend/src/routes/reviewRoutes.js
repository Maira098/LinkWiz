import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addReview,
  getReviewsForService
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:serviceId", getReviewsForService);

export default router;