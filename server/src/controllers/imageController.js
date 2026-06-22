import { getDestinationImages } from "../services/imageService.js";

export const fetchImages = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required.",
      });
    }

    const images = await getDestinationImages(city);

    res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};