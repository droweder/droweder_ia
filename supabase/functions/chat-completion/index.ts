import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, model } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid or empty 'messages' array provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("Missing OPENROUTER_API_KEY");
    }

    console.log("Sending to OpenRouter:", { model, messages });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://droweder-ai.com",
        "X-Title": "DRoweder AI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model, // Use the model selected by user
        messages: messages,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", response.status, errorText);
        return new Response(JSON.stringify({ error: `OpenRouter error: ${response.status}`, details: errorText }), {
            status: response.status, // pass through the 400 from OpenRouter
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Internal Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
