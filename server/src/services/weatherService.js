import axios from "axios";

export const getWeather = async (city) => {
  try {
    console.log("Weather API Key:", process.env.OPENWEATHER_API_KEY); 
    
    const url = "https://api.openweathermap.org/data/2.5/weather";

    const response = await axios.get(url, {
      params: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric",
      },
    });

    const data = response.data;

    return {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      windSpeed: data.wind.speed,
    };
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch weather.");
  }
};