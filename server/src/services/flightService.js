import axios from "axios";

export const searchFlights = async ({
  source,
  destination,
  startDate,
  adults,
}) => {
  const prompt = `
Generate exactly 3 realistic flight options.

Return ONLY valid JSON.

[
  {
    "airline": "",
    "flightNumber": "",
    "from": "",
    "to": "",
    "departureTime": "",
    "arrivalTime": "",
    "duration": "",
    "estimatedPrice": ""
  }
]

Source: ${source}
Destination: ${destination}
Departure Date: ${startDate}
Passengers: ${adults}

Use only real Indian airlines like:
- IndiGo
- Air India
- Akasa Air
- SpiceJet

Do not return markdown.
`;

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
          temperature: 0.5,
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

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Flight API Error:", error.response?.data || error.message);
    throw error;
  }
};