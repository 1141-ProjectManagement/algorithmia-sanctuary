import { useState, useRef, useCallback, useEffect } from "react";

interface UseTTSOptions {
  defaultSpeed?: number;
}

interface UseTTSReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isLoading: boolean;
  error: string | null;
  speed: number;
  setSpeed: (speed: number) => void;
}

export const SPEED_OPTIONS = [0.7, 0.85, 1, 1.1, 1.2] as const;

const CACHE_PREFIX = "tts_cache_";
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Generate cache key from text and speed
const getCacheKey = (text: string, speed: number): string => {
  const hash = text.split("").reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);
  return `${CACHE_PREFIX}${hash}_${speed}`;
};

// Convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Convert base64 to blob
const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(",");
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "audio/mpeg";
  const bstr = atob(parts[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
};

// Get cached audio
const getCachedAudio = (key: string): string | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_MAX_AGE) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

// Save audio to cache
const setCachedAudio = (key: string, base64: string): void => {
  try {
    const cacheEntry = JSON.stringify({
      data: base64,
      timestamp: Date.now(),
    });
    localStorage.setItem(key, cacheEntry);
  } catch (e) {
    // Storage quota exceeded - clear old TTS cache entries
    console.warn("localStorage quota exceeded, clearing TTS cache");
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  }
};

export const useTTS = ({ defaultSpeed = 1 }: UseTTSOptions = {}): UseTTSReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speed, setSpeed] = useState(defaultSpeed);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      const cacheKey = getCacheKey(text, speed);
      let audioBlob: Blob;
      
      // Check cache first
      const cachedBase64 = getCachedAudio(cacheKey);
      if (cachedBase64) {
        console.log("TTS: Using cached audio");
        audioBlob = base64ToBlob(cachedBase64);
      } else {
        console.log("TTS: Fetching from API");
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text, speed }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `TTS request failed: ${response.status}`);
        }

        audioBlob = await response.blob();
        
        // Cache the audio
        const base64 = await blobToBase64(audioBlob);
        setCachedAudio(cacheKey, base64);
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setError("Audio playback failed");
      };

      setIsSpeaking(true);
      await audio.play();
    } catch (err) {
      console.error("TTS error:", err);
      setError(err instanceof Error ? err.message : "TTS failed");
      setIsSpeaking(false);
    } finally {
      setIsLoading(false);
    }
  }, [speed]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
    speed,
    setSpeed,
  };
};
