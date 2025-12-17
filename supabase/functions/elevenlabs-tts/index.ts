import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error("Authentication failed:", authError?.message || "No user found");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`TTS request from authenticated user: ${user.id}`);

    const { text, speed = 1.5 } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      console.error("ELEVENLABS_API_KEY is not configured");
      throw new Error("TTS service configuration error");
    }

    // Input validation with length limits
    const MAX_TEXT_LENGTH = 5000;
    const MIN_TEXT_LENGTH = 1;

    if (!text || typeof text !== "string") {
      throw new Error("Text is required");
    }

    const trimmedText = text.trim()
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .replace(/\s+/g, ' '); // Normalize whitespace

    if (trimmedText.length < MIN_TEXT_LENGTH) {
      throw new Error("Text is too short");
    }

    if (trimmedText.length > MAX_TEXT_LENGTH) {
      throw new Error(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`);
    }

    const voiceId = "Qbw4VpyUrHEG7NigKzty";

    console.log(`Generating TTS for user ${user.id}, text length: ${text.length}, speed: ${speed}`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          output_format: "mp3_44100_128",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            speed: Math.min(Math.max(speed, 0.7), 1.2), // Clamp to valid range 0.7-1.2
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log(`TTS generated successfully for user ${user.id}, size: ${audioBuffer.byteLength} bytes`);

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    
    // Sanitize error messages - only return safe messages to client
    let safeMessage = "An error occurred processing your request";
    if (error instanceof Error) {
      const msg = error.message;
      // Allow through specific user-friendly error messages
      if (msg.includes("Text is required") || 
          msg.includes("Text is too short") ||
          msg.includes("exceeds maximum length") ||
          msg === "Unauthorized" ||
          msg === "Missing authorization header") {
        safeMessage = msg;
      }
    }
    
    return new Response(
      JSON.stringify({ error: safeMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
