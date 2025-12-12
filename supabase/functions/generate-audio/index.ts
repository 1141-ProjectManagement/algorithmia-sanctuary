import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    let prompt = "";
    let duration = 10;

    if (type === "bgm") {
      prompt = "Ancient mystical temple ambient music with soft ethereal pads, gentle wind chimes, distant echoing bells, mysterious atmosphere, meditation-like calm, loopable background music";
      duration = 60;
    } else if (type === "click") {
      prompt = "Magical golden chime sound effect, mystical button click, ancient temple bell tap, soft metallic ding with ethereal reverb";
      duration = 1;
    } else if (type === "success") {
      prompt = "Ancient sacred rune activation sound, mystical success chime with golden shimmer, magical achievement unlock, ethereal ascending tones";
      duration = 2;
    }

    // Use Sound Effects API for short sounds, Music API for BGM
    const isMusic = type === "bgm";
    const apiUrl = isMusic 
      ? "https://api.elevenlabs.io/v1/music/generate"
      : "https://api.elevenlabs.io/v1/sound-effects/generate";

    const body = isMusic
      ? { prompt, duration_seconds: duration }
      : { text: prompt, duration_seconds: duration };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = base64Encode(audioBuffer);

    return new Response(
      JSON.stringify({ audio: base64Audio, type }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error generating audio:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
