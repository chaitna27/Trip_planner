import { searchFlights } from "../services/flightService.js";

export const getFlights = async (req, res) => {
  try {
    const { source, destination, startDate, adults } = req.body;

    if (!source || !destination || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Source, destination and startDate are required.",
      });
    }

    const flights = await searchFlights({
      source,
      destination,
      startDate,
      adults: adults || 1,
    });

    res.status(200).json({
      success: true,
      flights,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};