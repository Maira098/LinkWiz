import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} from "../controllers/serviceController.js";

const router = express.Router();

router.post("/", protect, createService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

export default router;