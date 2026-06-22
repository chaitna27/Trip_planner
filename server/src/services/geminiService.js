import axios from "axios";

export const generateTrip = async (prompt) => {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    let text = response.data.candidates[0].content.parts[0].text;

    // Remove markdown if Gemini accidentally returns it
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return text;
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    throw error;
  }
};