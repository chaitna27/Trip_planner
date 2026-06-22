import express from "express";
import cors from "cors";
import morgan from "morgan";
import tripRoutes from "./routes/tripRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import savedTripRoutes from "./routes/savedTripRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/trips", tripRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved-trips", savedTripRoutes);
app.use("/api/flights", flightRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Trip Planner Backend Running 🚀",
  });
});

app.use(errorHandler);

export default app;