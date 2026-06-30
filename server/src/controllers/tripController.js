import { generateTrip } from "../services/geminiService.js";
import { getWeather } from "../services/weatherService.js";
import { searchHotels } from "../services/hotelService.js";
import { getDestinationImages, getActivityImage } from "../services/imageService.js";
import { buildTripPrompt } from "../utils/promptBuilder.js";
import Trip from "../models/Trip.js";
import { searchFlights } from "../services/flightService.js";

export const createTrip = async (req, res) => {
  try {
    const prompt = buildTripPrompt(req.body);

    const itinerary = await generateTrip(prompt);

    const trip = JSON.parse(itinerary);

    const destination = trip.destination || req.body.destination;

    // ── Phase 1: Fetch destination-level data in parallel ──────────────
    const [weather, hotels, images, flights] = await Promise.all([
      getWeather(destination),
      searchHotels(destination),
      getDestinationImages(destination),
      searchFlights({
        source: req.body.source,
        destination,
        startDate: req.body.startDate,
        adults: req.body.adults,
      }),
    ]);

    // ── Phase 2: Fetch one image per activity ───────────────────────────
    // Collect a flat list of activity references with their search queries
    const days = Array.isArray(trip.itinerary) ? trip.itinerary : [];

    const activityRefs = [];
    days.forEach((day, dayIdx) => {
      const acts = Array.isArray(day.activities) ? day.activities : [];
      acts.forEach((act, actIdx) => {
        // Only process activities that are proper objects (not plain strings)
        if (act && typeof act === "object") {
          const query = act.imageQuery || act.placeName || null;
          activityRefs.push({ dayIdx, actIdx, query });
        }
      });
    });

    console.log(
      `[TripController] Fetching images for ${activityRefs.length} activities...`
    );
    activityRefs.forEach(({ query }, i) =>
      console.log(`  [${i + 1}] query: "${query}"`)
    );

    if (activityRefs.length > 0) {
      // Promise.allSettled — never throws; each activity gets its own result
      const results = await Promise.allSettled(
        activityRefs.map(({ query }) =>
          query ? getActivityImage(query) : Promise.resolve(null)
        )
      );

      // Attach imageUrl directly onto each activity object
      activityRefs.forEach(({ dayIdx, actIdx }, i) => {
        const settled = results[i];
        const imageUrl =
          settled.status === "fulfilled" ? settled.value ?? null : null;

        days[dayIdx].activities[actIdx].imageUrl = imageUrl;

        console.log(
          `  [${i + 1}] "${activityRefs[i].query}" → ${imageUrl ? imageUrl.slice(0, 60) + "…" : "null"}`
        );
      });
    }

    // ── Save trip (itinerary now contains activity-level imageUrls) ─────
    const savedTrip = await Trip.create({
      user: req.user._id,
      source: req.body.source,
      destination: req.body.destination,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      adults: req.body.adults,
      children: req.body.children,
      budget: req.body.budget,
      interests: req.body.interests,
      itinerary: trip,
      weather,
      hotels,
      flights,
      images,
    });

    res.status(200).json({
      success: true,
      trip: savedTrip,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    await trip.deleteOne();

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
