import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AudioState {
  bgmPlaying: boolean;
  bgmLoaded: boolean;
  sfxEnabled: boolean;
  volume: number;
}

const AUDIO_CACHE_KEY = "algorithmia-audio-cache";
const AUDIO_PREFS_KEY = "algorithmia-audio-prefs";

export function useAudio() {
  const [state, setState] = useState<AudioState>(() => {
    const saved = localStorage.getItem(AUDIO_PREFS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      bgmPlaying: false,
      bgmLoaded: false,
      sfxEnabled: true,
      volume: 0.3,
    };
  });

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const clickSfxRef = useRef<HTMLAudioElement | null>(null);
  const successSfxRef = useRef<HTMLAudioElement | null>(null);

  // Save preferences
  useEffect(() => {
    localStorage.setItem(AUDIO_PREFS_KEY, JSON.stringify(state));
  }, [state]);

  // Load cached audio or generate new
  const loadAudio = useCallback(async (type: "bgm" | "click" | "success") => {
    const cache = localStorage.getItem(AUDIO_CACHE_KEY);
    const cached = cache ? JSON.parse(cache) : {};

    if (cached[type]) {
      return `data:audio/mpeg;base64,${cached[type]}`;
    }

    try {
      const { data, error } = await supabase.functions.invoke("generate-audio", {
        body: { type },
      });

      if (error) throw error;

      // Cache the audio
      cached[type] = data.audio;
      localStorage.setItem(AUDIO_CACHE_KEY, JSON.stringify(cached));

      return `data:audio/mpeg;base64,${data.audio}`;
    } catch (error) {
      console.error(`Failed to generate ${type} audio:`, error);
      return null;
    }
  }, []);

  // Initialize BGM
  const initBgm = useCallback(async () => {
    if (bgmRef.current) return;

    const audioUrl = await loadAudio("bgm");
    if (audioUrl) {
      bgmRef.current = new Audio(audioUrl);
      bgmRef.current.loop = true;
      bgmRef.current.volume = state.volume;
      setState(prev => ({ ...prev, bgmLoaded: true }));
    }
  }, [loadAudio, state.volume]);

  // Initialize SFX
  const initSfx = useCallback(async () => {
    if (!clickSfxRef.current) {
      const clickUrl = await loadAudio("click");
      if (clickUrl) {
        clickSfxRef.current = new Audio(clickUrl);
        clickSfxRef.current.volume = state.volume;
      }
    }

    if (!successSfxRef.current) {
      const successUrl = await loadAudio("success");
      if (successUrl) {
        successSfxRef.current = new Audio(successUrl);
        successSfxRef.current.volume = state.volume;
      }
    }
  }, [loadAudio, state.volume]);

  // Toggle BGM
  const toggleBgm = useCallback(() => {
    if (!bgmRef.current) {
      initBgm().then(() => {
        if (bgmRef.current) {
          bgmRef.current.play();
          setState(prev => ({ ...prev, bgmPlaying: true }));
        }
      });
      return;
    }

    if (state.bgmPlaying) {
      bgmRef.current.pause();
      setState(prev => ({ ...prev, bgmPlaying: false }));
    } else {
      bgmRef.current.play();
      setState(prev => ({ ...prev, bgmPlaying: true }));
    }
  }, [state.bgmPlaying, initBgm]);

  // Play click sound
  const playClick = useCallback(() => {
    if (!state.sfxEnabled) return;

    if (!clickSfxRef.current) {
      initSfx();
      return;
    }

    clickSfxRef.current.currentTime = 0;
    clickSfxRef.current.play().catch(() => {});
  }, [state.sfxEnabled, initSfx]);

  // Play success sound
  const playSuccess = useCallback(() => {
    if (!state.sfxEnabled) return;

    if (!successSfxRef.current) {
      initSfx();
      return;
    }

    successSfxRef.current.currentTime = 0;
    successSfxRef.current.play().catch(() => {});
  }, [state.sfxEnabled, initSfx]);

  // Toggle SFX
  const toggleSfx = useCallback(() => {
    setState(prev => ({ ...prev, sfxEnabled: !prev.sfxEnabled }));
  }, []);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
    if (bgmRef.current) bgmRef.current.volume = volume;
    if (clickSfxRef.current) clickSfxRef.current.volume = volume;
    if (successSfxRef.current) successSfxRef.current.volume = volume;
  }, []);

  // Preload SFX on mount
  useEffect(() => {
    initSfx();
  }, [initSfx]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  return {
    bgmPlaying: state.bgmPlaying,
    bgmLoaded: state.bgmLoaded,
    sfxEnabled: state.sfxEnabled,
    volume: state.volume,
    toggleBgm,
    toggleSfx,
    setVolume,
    playClick,
    playSuccess,
  };
}
