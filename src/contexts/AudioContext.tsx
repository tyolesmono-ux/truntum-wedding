'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { WEDDING_AUDIO_CONFIG } from '@/lib/config/wedding-data';

export interface AudioContextValue {
  readonly isPlaying: boolean;
  readonly isMuted: boolean;
  readonly isUnlocked: boolean;
  unlockAndPlay: () => Promise<void>;
  togglePlay: () => void;
  toggleMute: () => void;
}

const AudioContextInstance = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContextInstance);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

export interface AudioProviderProps {
  children: React.ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const wasPlayingBeforeHideRef = useRef<boolean>(false);
  const isPlayingRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);

  // Keep refs synchronized with state
  isPlayingRef.current = isPlaying;
  isMutedRef.current = isMuted;

  const initPipeline = useCallback(() => {
    if (!audioElementRef.current) {
      const audio = new Audio(WEDDING_AUDIO_CONFIG.src);
      audio.loop = WEDDING_AUDIO_CONFIG.loop;
      audioElementRef.current = audio;
    }

    if (!audioContextRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const gain = ctx.createGain();
        const source = ctx.createMediaElementSource(audioElementRef.current);

        source.connect(gain);
        gain.connect(ctx.destination);

        audioContextRef.current = ctx;
        gainNodeRef.current = gain;
      }
    }

    return {
      audio: audioElementRef.current,
      ctx: audioContextRef.current,
      gain: gainNodeRef.current,
    };
  }, []);

  const unlockAndPlay = useCallback(async () => {
    const { audio, ctx, gain } = initPipeline();

    if (ctx && ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (gain && ctx) {
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(
        isMutedRef.current ? 0.0001 : WEDDING_AUDIO_CONFIG.targetVolume,
        now + WEDDING_AUDIO_CONFIG.fadeDuration
      );
    } else if (audio) {
      audio.volume = isMutedRef.current ? 0 : WEDDING_AUDIO_CONFIG.targetVolume;
    }

    if (audio) {
      try {
        await audio.play();
        setIsPlaying(true);
        setIsUnlocked(true);
      } catch {
        // Handled silently if autoplay restricted
      }
    }
  }, [initPipeline]);

  const togglePlay = useCallback(() => {
    const { audio, ctx, gain } = initPipeline();

    if (isPlayingRef.current) {
      // Apply micro-fade out before pausing
      if (gain && ctx) {
        const now = ctx.currentTime;
        gain.gain.linearRampToValueAtTime(0.0001, now + WEDDING_AUDIO_CONFIG.microFadeDuration);
      }
      if (audio) {
        setTimeout(() => {
          audio.pause();
        }, WEDDING_AUDIO_CONFIG.microFadeDuration * 1000);
      }
      setIsPlaying(false);
    } else {
      // Resume playback with micro-fade in
      if (ctx && ctx.state === 'suspended') {
        void ctx.resume();
      }
      if (gain && ctx) {
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(
          isMutedRef.current ? 0.0001 : WEDDING_AUDIO_CONFIG.targetVolume,
          now + WEDDING_AUDIO_CONFIG.microFadeDuration
        );
      }
      if (audio) {
        void audio.play();
      }
      setIsPlaying(true);
      setIsUnlocked(true);
    }
  }, [initPipeline]);

  const toggleMute = useCallback(() => {
    const { gain, audio } = initPipeline();
    const nextMuted = !isMutedRef.current;
    setIsMuted(nextMuted);

    if (gain) {
      gain.gain.value = nextMuted ? 0.0001 : WEDDING_AUDIO_CONFIG.targetVolume;
    } else if (audio) {
      audio.volume = nextMuted ? 0 : WEDDING_AUDIO_CONFIG.targetVolume;
    }
  }, [initPipeline]);

  // Page visibility auto-pause / auto-resume
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioElementRef.current;
      if (!audio) return;

      if (document.visibilityState === 'hidden') {
        if (isPlayingRef.current) {
          wasPlayingBeforeHideRef.current = true;
          audio.pause();
          setIsPlaying(false);
        }
      } else if (document.visibilityState === 'visible') {
        if (wasPlayingBeforeHideRef.current) {
          wasPlayingBeforeHideRef.current = false;
          void audio.play();
          setIsPlaying(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const value: AudioContextValue = {
    isPlaying,
    isMuted,
    isUnlocked,
    unlockAndPlay,
    togglePlay,
    toggleMute,
  };

  return <AudioContextInstance.Provider value={value}>{children}</AudioContextInstance.Provider>;
}
