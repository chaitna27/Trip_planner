import SavedTrip from "../models/SavedTrip.js";
import Trip from "../models/Trip.js";

// Save a trip
export const saveTrip = async (req, res) => {
  try {
    const { tripId } = req.body;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    const alreadySaved = await SavedTrip.findOne({
      user: req.user._id,
      trip: tripId,
    });

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Trip already saved.",
      });
    }

    const savedTrip = await SavedTrip.create({
      user: req.user._id,
      trip: tripId,
    });

    res.status(201).json({
      success: true,
      message: "Trip saved successfully.",
      savedTrip,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all saved trips
export const getSavedTrips = async (req, res) => {
  try {
    const savedTrips = await SavedTrip.find({
      user: req.user._id,
    }).populate("trip");

    res.status(200).json({
      success: true,
      count: savedTrips.length,
      savedTrips,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove saved trip
export const removeSavedTrip = async (req, res) => {
  try {
    const savedTrip = await SavedTrip.findOne({
      user: req.user._id,
      trip: req.params.tripId,
    });

    if (!savedTrip) {
      return res.status(404).json({
        success: false,
        message: "Saved trip not found.",
      });
    }

    await savedTrip.deleteOne();

    res.status(200).json({
      success: true,
      message: "Trip removed from saved trips.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};