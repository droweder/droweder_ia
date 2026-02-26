import type { OpenRouterMessage, OpenRouterResponse } from '../types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const chatWithOpenRouter = async (
  model: string,
  messages: OpenRouterMessage[]
): Promise<OpenRouterResponse | null> => {
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API Key is missing');
    return null;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://droweder-ai.com", // Site URL
        "X-Title": "DRoweder AI", // Site Title
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenRouter API Error:", errorData);
        throw new Error(`OpenRouter API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch from OpenRouter:", error);
    return null;
  }
};
