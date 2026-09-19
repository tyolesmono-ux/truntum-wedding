'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { InvitationLetterProps } from '../../../specs/002-virtual-envelope-audio/contracts/virtual-envelope.contract';

export function InvitationLetter({
  guestName,
  isSliding = false,
  className,
}: InvitationLetterProps) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0.9 }}
      animate={
        isSliding
          ? {
              y: -64,
              opacity: 1,
              transition: {
                duration: 0.62,
                delay: 0.28,
                ease: [0.16, 1, 0.3, 1],
              },
            }
          : { y: 0, opacity: 0.9 }
      }
      data-testid="invitation-letter"
      className={cn(
        'absolute w-[276px] h-[176px] rounded-[3px] p-4 flex flex-col items-center justify-between text-center select-none',
        'bg-[#FCFAF5] border border-[#E8DCC8] shadow-[0_8px_20px_rgba(0,0,0,0.15)]',
        'z-10',
        className
      )}
    >
      {/* Decorative top header line */}
      <div className="w-full flex items-center justify-center gap-2 pt-1">
        <span className="h-[1px] w-8 bg-[#C2A05B]/40" />
        <span className="font-display text-[10px] uppercase tracking-widest text-[#8A7862]">
          Walimatul Ursy
        </span>
        <span className="h-[1px] w-8 bg-[#C2A05B]/40" />
      </div>

      {/* Center Couple Names & Guest Name */}
      <div className="space-y-1">
        <h3 className="font-display text-lg font-semibold text-[#231F1B] leading-snug">
          Ananda & Bagus
        </h3>
        <p className="font-body text-xs text-[#4A3E33]">
          Untuk Yang Terhormat:
        </p>
        <p className="font-display text-sm font-medium text-[#6B4423]">
          {guestName}
        </p>
      </div>

      {/* Bottom Date Note */}
      <div className="text-[11px] font-body text-[#8A7862] pb-1">
        Surakarta, 12 Desember 2026
      </div>
    </motion.div>
  );
}
