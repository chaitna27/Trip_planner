import axios from "axios";

export const searchHotels = async (city) => {
  try {
    // Step 1: Convert city name to coordinates
    const geoResponse = await axios.get(
      "https://api.geoapify.com/v1/geocode/search",
      {
        params: {
          text: city,
          apiKey: process.env.GEOAPIFY_API_KEY,
        },
      }
    );

    if (!geoResponse.data.features.length) {
      throw new Error("City not found");
    }

    const { lat, lon } = geoResponse.data.features[0].properties;
    console.log("Coordinates:", lat, lon);

    // Step 2: Search nearby hotels
    const hotelResponse = await axios.get(
      "https://api.geoapify.com/v2/places",
      {
        params: {
          categories: "accommodation.hotel",
          filter: `circle:${lon},${lat},35000`,
          limit: 10,
          apiKey: process.env.GEOAPIFY_API_KEY,
        },
      }
    );
    console.log(
      JSON.stringify(hotelResponse.data, null, 2)
    ); 

    return hotelResponse.data.features.map((hotel) => ({
      name: hotel.properties.name || "Unnamed Hotel",
      address: hotel.properties.formatted,
      latitude: hotel.properties.lat,
      longitude: hotel.properties.lon,
    }));
  } catch (error) {
    console.error(
      "Geoapify Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch hotels.");
  }
};