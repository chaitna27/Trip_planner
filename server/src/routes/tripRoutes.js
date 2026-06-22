import express from "express";
import {
  createTrip,
  getAllTrips,
  getTripById,
  deleteTrip,
} from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateTripRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/generate",
  protect,
  validateTripRequest,
  createTrip
);

router.get("/", protect, getAllTrips);

router.get("/:id", protect, getTripById);

router.delete("/:id", protect, deleteTrip);

export default router;