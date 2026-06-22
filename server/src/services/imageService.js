import axios from "axios";

export const getDestinationImages = async (city) => {
  try {
    const response = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query: city,
          per_page: 5,
          orientation: "landscape",
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    return response.data.results.map((image) => ({
      id: image.id,
      description: image.alt_description,
      imageUrl: image.urls.regular,
      thumbnail: image.urls.small,
      photographer: image.user.name,
    }));
  } catch (error) {
    console.error(
      "Unsplash Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch destination images.");
  }
};