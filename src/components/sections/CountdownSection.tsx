'use client';

import React from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { KawungBackground } from '@/components/ornaments/KawungBackground';

export interface CountdownSectionProps {
  readonly targetDate: string;
  readonly ceremonyTitle?: string;
}

interface TimeUnitBoxProps {
  readonly value: number;
  readonly label: string;
}

function TimeUnitBox({ value, label }: TimeUnitBoxProps) {
  // Format angka selalu 2 digit (misal: "08")
  const formattedValue = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center p-3 sm:p-5 bg-surakarta-surface/90 border border-surakarta-line rounded-card shadow-xs min-w-[64px] sm:min-w-[80px] md:min-w-[96px]">
      <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-surakarta-fg font-normal tracking-tight tabular-nums">
        {formattedValue}
      </span>
      <span className="font-body text-[11px] sm:text-xs md:text-sm text-surakarta-fg-muted uppercase tracking-wider mt-1 font-medium">
        {label}
      </span>
    </div>
  );
}

function PulsingColon() {
  return (
    <span
      aria-hidden="true"
      className="font-display text-2xl sm:text-3xl md:text-4xl text-surakarta-gold/80 animate-pulse self-center mb-4 sm:mb-6"
    >
      :
    </span>
  );
}

export function CountdownSection({
  targetDate,
  ceremonyTitle = 'Menuju Hari Bahagia',
}: CountdownSectionProps) {
  const { days, hours, minutes, seconds, isExpired, isMounted } = useCountdown(targetDate);

  return (
    <section
      role="region"
      aria-label="Hitung Mundur Hari Bahagia"
      className="relative py-20 md:py-28 px-6 bg-surakarta-bg text-surakarta-fg overflow-hidden text-center"
    >
      {/* Latar Tekstur Halus Kawung */}
      <KawungBackground />

      <div className="relative z-10 max-w-xl mx-auto space-y-8">
        {/* Judul Seksi */}
        <div className="space-y-2">
          <p className="font-body text-xs md:text-sm tracking-[0.08em] text-surakarta-brand-soft uppercase font-medium">
            Waktu yang Ditunggu
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-surakarta-fg tracking-tight">
            {ceremonyTitle}
          </h2>
        </div>

        {/* Kontainer Timer berbingkai Gunungan Prada */}
        <div className="relative p-6 sm:p-8 rounded-card border border-surakarta-gold/40 bg-surakarta-surface/40 backdrop-blur-xs shadow-sm">
          {/* Siluet Sudut Gunungan Hias Prada */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-surakarta-bg">
            <svg
              className="w-6 h-6 text-surakarta-gold opacity-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2 L20 16 C20 21 16 22 12 22 C8 22 4 21 4 16 Z" />
              <circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.6" />
            </svg>
          </div>

          {isMounted && isExpired ? (
            // Pesan Status Pasca-Acara
            <div className="py-6 px-4 space-y-2">
              <p className="font-display text-2xl text-surakarta-brand">
                Alhamdulillah
              </p>
              <p className="font-body text-sm sm:text-base text-surakarta-fg-body">
                Rangkaian acara pernikahan sedang atau telah berlangsung dengan penuh berkah.
              </p>
            </div>
          ) : (
            // Grid 4 Unit Waktu Reaktif & SSR-safe Placeholder
            <div className={`flex items-center justify-center space-x-1.5 sm:space-x-3 md:space-x-4 ${!isMounted ? 'opacity-60' : ''}`}>
              {[
                { value: isMounted ? days : 0, label: 'Hari' },
                { value: isMounted ? hours : 0, label: 'Jam' },
                { value: isMounted ? minutes : 0, label: 'Menit' },
                { value: isMounted ? seconds : 0, label: 'Detik' },
              ].map((unit, index) => (
                <React.Fragment key={unit.label}>
                  {index > 0 && <PulsingColon />}
                  <TimeUnitBox value={unit.value} label={unit.label} />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
