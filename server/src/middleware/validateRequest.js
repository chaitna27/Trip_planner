export const validateTripRequest = (req, res, next) => {
  const {
    source,
    destination,
    startDate,
    endDate,
    adults,
    budget,
    interests,
  } = req.body;

  if (!source || !destination) {
    return res.status(400).json({
      success: false,
      message: "Source and destination are required.",
    });
  }

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Start date and end date are required.",
    });
  }

  if (!adults || adults < 1) {
    return res.status(400).json({
      success: false,
      message: "At least one adult is required.",
    });
  }

  if (!budget) {
    return res.status(400).json({
      success: false,
      message: "Budget is required.",
    });
  }

  if (!Array.isArray(interests)) {
    return res.status(400).json({
      success: false,
      message: "Interests must be an array.",
    });
  }

  next();
};