import { searchHotels } from "../services/hotelService.js";

export const getHotels = async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({
                success: false,
                message: "City is required."
            });
        }

        const hotels = await searchHotels(city);

        res.status(200).json({
            success: true,
            hotels
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};