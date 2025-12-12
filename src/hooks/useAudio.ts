import { useState, useEffect, useRef, useCallback } from "react";

interface AudioState {
  bgmPlaying: boolean;
  sfxEnabled: boolean;
  volume: number;
}

const AUDIO_PREFS_KEY = "algorithmia-audio-prefs";

// Audio engine using HTML5 Audio for BGM and Web Audio API for SFX
class TempleAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private isPlaying = false;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
    }
    return this.audioContext;
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext?.currentTime || 0);
    }
    if (this.bgmAudio) {
      this.bgmAudio.volume = volume;
    }
  }

  // Play MP3 background music
  startBgm(volume: number) {
    if (this.isPlaying) return;
    
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio("/audio/bgm-temple.mp3");
      this.bgmAudio.loop = true;
    }
    
    this.bgmAudio.volume = volume;
    this.bgmAudio.play().catch(console.error);
    this.isPlaying = true;
  }

  stopBgm() {
    if (!this.isPlaying || !this.bgmAudio) return;
    
    this.bgmAudio.pause();
    this.bgmAudio.currentTime = 0;
    this.isPlaying = false;
  }

  // Mystical chime click sound
  playClick(volume: number) {
    const ctx = this.getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Golden chime frequencies
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.1);
      
      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      
      osc.start(now + i * 0.02);
      osc.stop(now + 0.5);
    });
  }

  // Sacred rune success sound
  playSuccess(volume: number) {
    const ctx = this.getContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    
    // Ascending mystical scale
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = i < 3 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);
      
      const startTime = now + i * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.25, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
      
      osc.connect(gain);
      gain.connect(this.masterGain || ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 1);
    });

    // Add shimmer effect
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(1046.5, now); // C6
    
    shimmerGain.gain.setValueAtTime(0, now + 0.5);
    shimmerGain.gain.linearRampToValueAtTime(volume * 0.1, now + 0.6);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    shimmer.connect(shimmerGain);
    shimmerGain.connect(this.masterGain || ctx.destination);
    shimmer.start(now + 0.5);
    shimmer.stop(now + 2);
  }

  cleanup() {
    this.stopBgm();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export function useAudio() {
  const [state, setState] = useState<AudioState>(() => {
    const saved = localStorage.getItem(AUDIO_PREFS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { bgmPlaying: false, sfxEnabled: true, volume: 0.3 };
      }
    }
    return { bgmPlaying: false, sfxEnabled: true, volume: 0.3 };
  });

  const engineRef = useRef<TempleAudioEngine | null>(null);

  // Initialize audio engine
  useEffect(() => {
    engineRef.current = new TempleAudioEngine();
    return () => {
      engineRef.current?.cleanup();
    };
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem(AUDIO_PREFS_KEY, JSON.stringify(state));
  }, [state]);

  // Update volume when it changes
  useEffect(() => {
    engineRef.current?.setVolume(state.volume);
  }, [state.volume]);

  // Toggle BGM
  const toggleBgm = useCallback(() => {
    if (state.bgmPlaying) {
      engineRef.current?.stopBgm();
      setState(prev => ({ ...prev, bgmPlaying: false }));
    } else {
      engineRef.current?.startBgm(state.volume);
      setState(prev => ({ ...prev, bgmPlaying: true }));
    }
  }, [state.bgmPlaying, state.volume]);

  // Play click sound
  const playClick = useCallback(() => {
    if (!state.sfxEnabled) return;
    engineRef.current?.playClick(state.volume);
  }, [state.sfxEnabled, state.volume]);

  // Play success sound
  const playSuccess = useCallback(() => {
    if (!state.sfxEnabled) return;
    engineRef.current?.playSuccess(state.volume);
  }, [state.sfxEnabled, state.volume]);

  // Toggle SFX
  const toggleSfx = useCallback(() => {
    setState(prev => ({ ...prev, sfxEnabled: !prev.sfxEnabled }));
  }, []);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
  }, []);

  return {
    bgmPlaying: state.bgmPlaying,
    bgmLoaded: true, // Always ready with Web Audio API
    sfxEnabled: state.sfxEnabled,
    volume: state.volume,
    toggleBgm,
    toggleSfx,
    setVolume,
    playClick,
    playSuccess,
  };
}
