const OLLAMA_API_KEY = import.meta.env.VITE_OLLAMA_API_KEY;
const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_BASE_URL || "https://ollama.com";
const CHAT_MODEL = import.meta.env.VITE_CHAT_MODEL || "gpt-oss:120b-cloud";
const ITINERARY_MODEL = import.meta.env.VITE_ITINERARY_MODEL || "gpt-oss:120b-cloud";

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
const ollamaFetch = async (messages, model) => {
  const response = await fetch(`/ollama/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OLLAMA_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.message?.content || "No response received.";
};

// ─── Travel Chatbot ───────────────────────────────────────────────────────────
export const chatWithTravelBot = async (conversationHistory) => {
  const systemMessage = {
    role: "system",
    content: `You are an expert travel concierge with 20+ years of global travel experience. 
You provide warm, specific, and deeply knowledgeable travel advice covering:
- Best times to visit destinations, weather patterns, seasonal events
- Hidden gems and off-the-beaten-path experiences beyond tourist traps
- Visa requirements, entry rules, and travel documentation
- Local culture, etiquette, customs, and language tips
- Budget breakdowns — accommodation, food, transport, activities
- Safety tips, health precautions, emergency contacts
- Specific hotel, restaurant, and attraction recommendations backed by reviews
- Packing lists tailored to destination and season

Keep responses conversational, warm and inspiring. Use specific names and details.
Use occasional travel emojis (🌍✈️🏨🍜) but sparingly. Format with short paragraphs.
Never give vague or generic advice — always be specific and actionable.`,
  };

  const messages = [systemMessage, ...conversationHistory];
  return await ollamaFetch(messages, CHAT_MODEL);
};

// ─── Itinerary Generator ──────────────────────────────────────────────────────
export const generateItinerary = async ({ destination, days, people, budget, interests, currency }) => {
  const interestStr =
    interests.length > 0 ? `Travel interests/focus: ${interests.join(", ")}.` : "";

  const systemMessage = {
    role: "system",
    content: `You are a world-class travel planner specializing in crafting highly detailed, 
personalized travel itineraries. You have deep knowledge of hotels, local restaurants, 
hidden attractions, transport logistics, and practical travel tips worldwide.
Your itineraries feel personally curated — not generic tourist guides.
Always use specific names, addresses, price ranges, and insider tips.`,
  };

  const userMessage = {
    role: "user",
    content: `Create a detailed ${days}-day travel itinerary for ${destination} for ${people} traveller(s).
Budget style: ${budget}. Preferred currency: ${currency || "USD"}. ${interestStr}

Structure EXACTLY as follows for each day:

Day [N]: [Catchy Theme Title for the Day]

ACCOMMODATION:
[Specific hotel/hostel/resort name, why it's great, location, price range per night in ${currency || "USD"}, booking tip]

MORNING:
[Specific activities with venue names, opening hours, entry fees, insider tips]

AFTERNOON:
[Continued exploration — specific venues, routes, what to look for]

LUNCH:
[Specific restaurant name, cuisine, must-order dish, price range, address or area]

DINNER:
[Specific restaurant name, cuisine, ambiance, reservation tips, price range]

EVENING:
[Nightlife, sunset spots, cultural shows, or relaxing options with specific venues]

GETTING AROUND:
[Exact transport: metro lines, bus numbers, taxi apps, walking directions, estimated costs]

LOCAL TIPS:
[Cultural notes, scams to avoid, dress code, best photo spots, timing secrets]

---

After all days include:

BUDGET SUMMARY:
[Daily cost breakdown per person: accommodation, food, transport, activities, total estimate]

VISA & ENTRY:
[Requirements for most common nationalities, processing time, cost]

BEST TIME TO VISIT:
[Month-by-month breakdown, peak vs off-season]

EMERGENCY CONTACTS:
[Police, ambulance, tourist helpline, nearest embassy info]

USEFUL PHRASES:
[5-8 local language phrases with pronunciation]

Make every recommendation specific, reviewed-backed, and genuinely useful.`,
  };

  return await ollamaFetch([systemMessage, userMessage], ITINERARY_MODEL);
};