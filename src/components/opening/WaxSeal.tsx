'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export interface WaxSealProps {
  onClick: () => void;
  isOpening?: boolean;
  monogram?: string;
  className?: string;
}

export function WaxSeal({
  onClick,
  isOpening = false,
  monogram = 'A & B',
  className,
}: WaxSealProps) {
  const shouldReduceMotion = usePrefersReducedMotion();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isOpening) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isOpening) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.button
      type="button"
      aria-label="Buka undangan"
      disabled={isOpening}
      data-testid="envelope-wax-seal"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      animate={
        isOpening
          ? shouldReduceMotion
            ? { opacity: 0.4, transition: { duration: 0.2 } }
            : {
                scale: [1, 1.08, 0.96],
                opacity: [1, 0.9, 0.4],
                transition: { duration: 0.18, ease: 'easeOut' },
              }
          : { scale: 1, opacity: 1 }
      }
      whileHover={!isOpening && !shouldReduceMotion ? { scale: 1.04 } : undefined}
      whileTap={!isOpening && !shouldReduceMotion ? { scale: 0.96 } : undefined}
      className={cn(
        'relative w-[72px] h-[72px] rounded-full flex items-center justify-center cursor-pointer select-none',
        'bg-gradient-to-br from-[#A63A30] via-[#8C2F27] to-[#6E241E]',
        'border border-[#C2A05B]/50 shadow-[0_4px_10px_rgba(0,0,0,0.4)]',
        'focus-visible:ring-2 focus-visible:ring-surakarta-gold focus-visible:ring-offset-4 focus:outline-none',
        'transition-shadow duration-200',
        className
      )}
    >
      {/* Decorative inner engraved ring */}
      <div className="absolute inset-[3px] rounded-full border border-[#D9BE85]/30 pointer-events-none" />

      {/* Monogram Text in Prada Gold */}
      <span className="relative z-10 font-display text-[15px] font-semibold text-[#D9BE85] tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        {monogram}
      </span>
    </motion.button>
  );
}
