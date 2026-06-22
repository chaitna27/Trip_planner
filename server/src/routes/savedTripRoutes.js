import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  saveTrip,
  getSavedTrips,
  removeSavedTrip,
} from "../controllers/savedTripController.js";

const router = express.Router();

router.post("/", protect, saveTrip);

router.get("/", protect, getSavedTrips);

router.delete("/:tripId", protect, removeSavedTrip);

export default router;