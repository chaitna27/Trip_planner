import express from "express";
import { getFlights } from "../controllers/flightController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/search", protect, getFlights);

export default router;