'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { WaxSeal } from './WaxSeal';
import { InvitationLetter } from './InvitationLetter';
import { useAudio } from '@/contexts/AudioContext';
import { VirtualEnvelopeProps } from '../../../specs/002-virtual-envelope-audio/contracts/virtual-envelope.contract';

export function VirtualEnvelope({ guestName, onOpened }: VirtualEnvelopeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Audio engine context integration (graceful if outside provider)
  let audioContext: ReturnType<typeof useAudio> | null = null;
  try {
    audioContext = useAudio();
  } catch {
    audioContext = null;
  }

  // Sanitized display name with formal fallback
  const displayName = guestName && guestName.trim().length > 0 ? guestName.trim() : 'Tamu Undangan';

  // Body scroll lock management
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpened]);

  // Master sequence orchestrator
  const handleOpen = useCallback(() => {
    if (hasInteracted || isOpening || isOpened) return;

    setHasInteracted(true);
    setIsOpening(true);

    // Physical user gesture unlocks audio engine
    if (audioContext) {
      void audioContext.unlockAndPlay();
    }

    // Motion sequence:
    // 0-180ms: Wax seal cracks
    // 180ms-880ms: Flap flips 180deg
    // 280ms-900ms: Letter slides upward
    // 760ms-1260ms: Fade-out overlay
    const completeTimer = setTimeout(() => {
      setIsOpened(true);
      document.body.style.overflow = '';
      if (onOpened) {
        onOpened();
      }
    }, 1300);

    return () => clearTimeout(completeTimer);
  }, [hasInteracted, isOpening, isOpened, audioContext, onOpened]);

  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.div
          key="virtual-envelope-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between py-10 px-4 select-none overflow-hidden"
          style={{
            background: 'radial-gradient(circle at center, #221D18 0%, #15120F 100%)',
          }}
        >
          {/* Top Etiquette & Guest Personalization */}
          <div className="w-full max-w-sm mx-auto text-center space-y-2 pt-2">
            <p className="font-body text-xs md:text-sm text-[#8A7862] tracking-wider">
              Kepada Bapak/Ibu/Saudara
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-normal text-[#EFE6D6] tracking-normal px-2">
              {displayName}
            </h1>
            <div className="flex items-center justify-center gap-2 pt-1 opacity-60">
              <span className="h-[1px] w-6 bg-[#C2A05B]" />
              <span className="font-body text-[10px] text-[#C2A05B]">✦</span>
              <span className="h-[1px] w-6 bg-[#C2A05B]" />
            </div>
          </div>

          {/* 3D Realistic Virtual Envelope Container */}
          <div className="relative my-auto [perspective:1200px] flex items-center justify-center">
            <div
              className={cn(
                'relative w-[300px] h-[200px] [transform-style:preserve-3d]',
                'transition-transform duration-300'
              )}
            >
              {/* Layer 0: Backplate */}
              <div
                className={cn(
                  'absolute inset-0 rounded-[3px]',
                  'bg-[#E8DCC8] border border-[#DFD1B8]',
                  'shadow-[0_24px_48px_rgba(0,0,0,0.45)]',
                  'z-0 overflow-hidden'
                )}
              >
                {/* Decorative Lung-lungan corner accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#C2A05B]/30" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#C2A05B]/30" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#C2A05B]/30" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#C2A05B]/30" />
              </div>

              {/* Layer 10: Sliding Invitation Letter */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <InvitationLetter
                  guestName={displayName}
                  isSliding={isOpening}
                />
              </div>

              {/* Layer 20: Pocket Front (Trapezoid / V-Shape Pocket) */}
              <div
                className={cn(
                  'absolute inset-0 rounded-b-[3px] z-20 pointer-events-none',
                  'bg-gradient-to-t from-[#E8DCC8] via-[#E2D4BE] to-[#DFD1B8]',
                  'shadow-[0_-2px_10px_rgba(0,0,0,0.06)]'
                )}
                style={{
                  clipPath: 'polygon(0% 0%, 50% 55%, 100% 0%, 100% 100%, 0% 100%)',
                }}
              />

              {/* Layer 30: Top Flap (Hinged fold rotating -180deg) */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={
                  isOpening
                    ? {
                        rotateX: -180,
                        transition: {
                          duration: 0.7,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }
                    : { rotateX: 0 }
                }
                style={{
                  transformOrigin: 'top center',
                  backfaceVisibility: 'hidden',
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                }}
                className={cn(
                  'absolute top-0 left-0 right-0 h-[115px] z-30 pointer-events-none',
                  'bg-gradient-to-b from-[#DFD1B8] to-[#D5C6AB]',
                  'border-b border-[#C2A05B]/20 shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                )}
              />

              {/* Layer 40: Wax Seal Stamp (Centered at flap fold junction) */}
              <div className="absolute top-[82px] left-1/2 -translate-x-1/2 z-40">
                <WaxSeal
                  onClick={handleOpen}
                  isOpening={isOpening}
                  monogram="A & B"
                />
              </div>
            </div>
          </div>

          {/* Bottom Primary CTA Action */}
          <div className="w-full max-w-xs mx-auto text-center pb-2">
            <button
              type="button"
              data-testid="envelope-cta-button"
              disabled={isOpening}
              onClick={handleOpen}
              aria-label="Buka undangan"
              className={cn(
                'w-full h-12 px-6 rounded-[2px] font-body text-[15px] font-medium tracking-wide',
                'bg-[#6B4423] text-[#FCFAF5] shadow-[0_4px_16px_rgba(0,0,0,0.3)]',
                'hover:bg-[#5A381C] active:scale-[0.98] transition-all duration-150',
                'focus-visible:ring-2 focus-visible:ring-[#C2A05B] focus-visible:ring-offset-4 focus:outline-none',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              Buka undangan
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
