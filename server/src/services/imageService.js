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

/**
 * Fetch a single image URL for a specific activity/place query.
 * Returns the image URL string, or null on failure (never throws).
 */
export const getActivityImage = async (query) => {
  try {
    const response = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query,
          per_page: 1,
          orientation: "landscape",
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const first = response.data.results?.[0];
    return first ? first.urls.regular : null;
  } catch (error) {
    console.error(
      "Unsplash activity image error for query:",
      query,
      error.response?.data || error.message
    );
    return null; // Fail gracefully — do not block trip creation
  }
};