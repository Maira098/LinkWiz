import express from "express";
import { protect } from "../middleware/auth.js";

import {
  sendExchangeRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  completeExchange,
  getExchangeById
} from "../controllers/exchangeController.js";
const router = express.Router();

// Send exchange request
router.post("/", protect, sendExchangeRequest);

// Get my requests
router.get("/sent", protect, getSentRequests);
router.get("/received", protect, getReceivedRequests);
router.get("/:id", protect, getExchangeById);
// Update exchange status

router.put("/:id/accept", protect, acceptRequest);
router.put("/:id/reject", protect, rejectRequest);
router.put("/:id/complete", protect, completeExchange);

export default router;