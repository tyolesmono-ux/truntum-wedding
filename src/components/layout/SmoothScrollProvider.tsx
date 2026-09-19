'use client';

import React from 'react';
import { ReactLenis } from 'lenis/react';

export interface SmoothScrollProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Wrapper Smooth Scroll global berbasis Lenis Engine.
 * Konfigurasi disesuaikan dengan SSoT DESIGN.md Bagian 7:
 * - lerp: 0.085 untuk inersia editorial mewah di desktop
 * - wheelMultiplier: 1
 * - touchMultiplier: 1.6
 * - syncTouch: false (WAJIB) untuk memastikan scroll sentuh ponsel berjalan secara native 60–120 FPS
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisOptions = {
    lerp: 0.085,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
    syncTouch: false,
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
