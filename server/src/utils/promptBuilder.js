export const buildTripPrompt = (tripData) => {
  const {
    source,
    destination,
    startDate,
    endDate,
    travelers,
    budget,
    interests,
  } = tripData;

  return `
You are an expert AI Travel Planner.

Generate a detailed travel itinerary based on the following trip details.

Trip Details:
- Source: ${source}
- Destination: ${destination}
- Start Date: ${startDate}
- End Date: ${endDate}
- Number of Travelers: ${travelers}
- Budget: ${budget}
- Interests: ${interests.join(", ")}

Instructions:
- Suggest activities according to the user's interests.
- Keep the itinerary within the specified budget.
- Recommend local food.
- Estimate daily expenses.
- Include practical travel tips and packing suggestions.

Return ONLY valid JSON.

The JSON must follow EXACTLY this structure:

{
  "destination": "",
  "duration": "",
  "budget": "",
  "bestTimeToVisit": "",
  "estimatedTotalCost": "",
  "tripSummary": "",
  "itinerary": [
    {
      "day": 1,
      "title": "",
      "activities": [],
      "foodSuggestions": [],
      "estimatedCost": ""
    }
  ],
  "packingTips": [],
  "travelTips": []
}

Do NOT return markdown.
Do NOT return explanations.
Return ONLY JSON.
`;
};