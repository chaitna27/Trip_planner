import { generateTrip } from "../services/geminiService.js";
import { getWeather } from "../services/weatherService.js";
import { searchHotels } from "../services/hotelService.js";
import { getDestinationImages } from "../services/imageService.js";
import { buildTripPrompt } from "../utils/promptBuilder.js";
import Trip from "../models/Trip.js";
import { searchFlights } from "../services/flightService.js";

export const createTrip = async (req, res) => {
  try {
    const prompt = buildTripPrompt(req.body);

    const itinerary = await generateTrip(prompt);

    const trip = JSON.parse(itinerary);

    const destination = trip.destination || req.body.destination;

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
