'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLenis } from 'lenis/react';
import { GalleryPhoto } from '@/lib/config/wedding-content';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export interface LightboxModalProps {
  readonly isOpen: boolean;
  readonly activeIndex: number;
  readonly photos: readonly GalleryPhoto[];
  readonly onClose: () => void;
  readonly onNavigate: (newIndex: number) => void;
}

/** Ambang batas gestur sentuh, sesuai contracts/ui-contracts.md bagian 3.2. */
const NAVIGATE_THRESHOLD = 60;
const DISMISS_THRESHOLD = 100;
const DOUBLE_TAP_DELAY = 300;
const EDGE_RESISTANCE = 30;

/**
 * Modal pratinjau foto layar penuh: navigasi usap horizontal, usap ke bawah untuk
 * menutup, ketukan ganda untuk memperbesar, tombol panah/Escape, dan penguncian
 * pengguliran Lenis selama modal terbuka.
 */
export function LightboxModal({
  isOpen,
  activeIndex,
  photos,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  const shouldReduceMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const [isZoomed, setIsZoomed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const touchStart = useRef({ x: 0, y: 0 });
  const lastTapAt = useRef(0);

  const total = photos.length;
  const activePhoto = photos[activeIndex];

  const goTo = useCallback(
    (index: number) => onNavigate(Math.max(0, Math.min(total - 1, index))),
    [onNavigate, total]
  );

  // Reset status perbesaran setiap kali foto berganti atau modal dibuka/ditutup
  useEffect(() => {
    setIsZoomed(false);
  }, [isOpen, activeIndex]);

  const handleTouchStart = (event: React.TouchEvent) => {
    try {
      dragX.stop();
      dragY.stop();
    } catch {
      // safe fallback if stop is not available
    }
    dragX.set(0);
    dragY.set(0);
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const rawX = event.touches[0].clientX - touchStart.current.x;
    const rawY = event.touches[0].clientY - touchStart.current.y;

    // Resistansi halus saat mengusap melewati foto pertama atau terakhir.
    const atStart = activeIndex === 0 && rawX > 0;
    const atEnd = activeIndex === total - 1 && rawX < 0;
    dragX.set(atStart || atEnd ? Math.sign(rawX) * Math.min(Math.abs(rawX), EDGE_RESISTANCE) : rawX);
    dragY.set(isZoomed ? 0 : Math.max(rawY, 0));
  };

  const handleTouchEnd = () => {
    const deltaX = dragX.get();
    const deltaY = dragY.get();
    const now = Date.now();
    const isTap = Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10;
    const isDoubleTap = isTap && now - lastTapAt.current < DOUBLE_TAP_DELAY;

    lastTapAt.current = isDoubleTap ? 0 : isTap ? now : lastTapAt.current;

    if (isDoubleTap) {
      setIsZoomed((zoomed) => !zoomed);
    } else if (!isZoomed) {
      if (deltaY > DISMISS_THRESHOLD) {
        onClose();
        dragX.set(0);
        dragY.set(0);
        return;
      }
      if (deltaX < -NAVIGATE_THRESHOLD) {
        goTo(activeIndex + 1);
        dragX.set(0);
        dragY.set(0);
        return;
      }
      if (deltaX > NAVIGATE_THRESHOLD) {
        goTo(activeIndex - 1);
        dragX.set(0);
        dragY.set(0);
        return;
      }
    }

    if (shouldReduceMotion) {
      dragX.set(0);
      dragY.set(0);
    } else {
      animate(dragX, 0, { type: 'spring', stiffness: 400, damping: 30 });
      animate(dragY, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  };

  // Kunci pengguliran Lenis dan fokuskan kontrol tutup selama modal terbuka.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      previouslyFocused?.focus();
    };
  }, [isOpen, lenis]);

  // Peta tombol keyboard & focus trap WAI-ARIA
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        goTo(activeIndex - 1);
      } else if (event.key === 'ArrowRight') {
        goTo(activeIndex + 1);
      } else if (event.key === 'Tab') {
        const focusables = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])') ?? []
        ).filter((el) => {
          if (typeof el.checkVisibility === 'function') return el.checkVisibility();
          return el.offsetParent !== null || window.getComputedStyle(el).display !== 'none';
        });

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (!dialogRef.current?.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, goTo, onClose]);

  return (
    <AnimatePresence>
      {isOpen && activePhoto && (
        <motion.div
          ref={dialogRef}
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau foto resolusi penuh"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: 'easeOut' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 flex flex-col bg-surakarta-bg-dark/95 backdrop-blur-sm"
        >
          {/* Bilah atas: nomor foto tabular dan tombol tutup */}
          <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <span
              data-testid="lightbox-counter"
              className="font-body text-sm font-medium tabular-nums text-surakarta-gold-light"
            >
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Tutup pratinjau foto"
              className="flex h-11 w-11 items-center justify-center text-surakarta-fg-on-dark transition-colors hover:text-surakarta-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-surakarta-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surakarta-bg-dark"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </header>

          {/* Area foto: gestur usap dan ketukan ganda */}
          <main
            data-testid="lightbox-stage"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative flex flex-1 touch-none items-center justify-center overflow-hidden px-2 py-4 sm:px-6"
          >
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Foto sebelumnya"
              className="absolute left-2 z-10 hidden h-11 w-11 items-center justify-center text-surakarta-fg-on-dark transition-colors hover:text-surakarta-gold-light disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-surakarta-gold sm:flex"
            >
              <ChevronLeft className="h-7 w-7" aria-hidden="true" />
            </button>

            <motion.div
              data-testid="lightbox-image"
              data-zoomed={isZoomed ? 'true' : 'false'}
              style={{ x: dragX, y: dragY }}
              animate={{ scale: isZoomed ? 2 : 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
              className="flex max-h-full items-center justify-center"
            >
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                width={activePhoto.width}
                height={activePhoto.height}
                sizes="100vw"
                unoptimized={activePhoto.src.endsWith('.svg')}
                draggable={false}
                className="max-h-[70vh] w-auto max-w-full select-none object-contain"
              />
            </motion.div>

            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === total - 1}
              aria-label="Foto berikutnya"
              className="absolute right-2 z-10 hidden h-11 w-11 items-center justify-center text-surakarta-fg-on-dark transition-colors hover:text-surakarta-gold-light disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-surakarta-gold sm:flex"
            >
              <ChevronRight className="h-7 w-7" aria-hidden="true" />
            </button>
          </main>

          {/* Bilah bawah: keterangan foto editorial */}
          <footer className="flex min-h-[56px] shrink-0 items-center justify-center px-6 py-3 text-center">
            <p className="mx-auto max-w-xl font-body text-sm text-surakarta-fg-on-dark">
              {activePhoto.caption}
            </p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
