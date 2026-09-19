'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudio } from '@/contexts/AudioContext';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export interface FloatingVinylProps {
  className?: string;
}

export function FloatingVinyl({ className }: FloatingVinylProps) {
  const { isPlaying, togglePlay } = useAudio();
  const shouldReduceMotion = usePrefersReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      togglePlay();
    }
  };

  return (
    <button
      type="button"
      role="button"
      onClick={togglePlay}
      onKeyDown={handleKeyDown}
      aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
      aria-pressed={isPlaying}
      data-playing={isPlaying ? 'true' : 'false'}
      data-reduced-motion={shouldReduceMotion ? 'true' : 'false'}
      data-testid="floating-vinyl-player"
      className={cn(
        'fixed bottom-5 right-5 z-40',
        'w-[52px] h-[52px] rounded-full p-0 cursor-pointer select-none',
        'bg-[#231F1B] border border-[#D9BE85]/35',
        'shadow-[0_4px_16px_rgba(0,0,0,0.35)]',
        'flex items-center justify-center',
        'focus-visible:ring-2 focus-visible:ring-surakarta-gold focus-visible:ring-offset-4 focus:outline-none',
        'hover:scale-105 active:scale-95 transition-transform duration-150',
        className
      )}
    >
      {/* Vinyl Disc Body with Continuous Rotation */}
      <div
        className={cn(
          'relative w-full h-full rounded-full overflow-hidden flex items-center justify-center',
          !shouldReduceMotion && 'motion-safe:animate-[spin_12s_linear_infinite]'
        )}
        style={{
          animationPlayState: !shouldReduceMotion && isPlaying ? 'running' : 'paused',
        }}
      >
        {/* Grooves: 3 Concentric Engraved Rings */}
        <div className="absolute inset-[6px] rounded-full border border-[#D9BE85]/18 pointer-events-none" />
        <div className="absolute inset-[11px] rounded-full border border-[#D9BE85]/18 pointer-events-none" />
        <div className="absolute inset-[16px] rounded-full border border-[#D9BE85]/18 pointer-events-none" />

        {/* Center Spindle Label (18px) */}
        <div className="relative z-10 w-[18px] h-[18px] rounded-full bg-[#6B4423] border border-[#C2A05B]/60 flex items-center justify-center shadow-inner">
          {/* Subtle center hole */}
          <div className="w-[4px] h-[4px] rounded-full bg-[#15120F]" />
        </div>
      </div>

      {/* Reduced Motion Indicator (Visible when motion is reduced) */}
      <div
        data-testid="reduced-motion-indicator"
        className={cn(
          'absolute inset-0 items-center justify-center pointer-events-none text-[#D9BE85]',
          shouldReduceMotion ? 'flex' : 'hidden motion-reduce:flex'
        )}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </div>
    </button>
  );
}
