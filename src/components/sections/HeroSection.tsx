'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export interface HeroSectionProps {
  readonly groomName: string;
  readonly brideName: string;
  readonly weddingDateText: string;
  readonly locationText: string;
  readonly coverImageUrl: string;
}

export function HeroSection({
  groomName,
  brideName,
  weddingDateText,
  locationText,
  coverImageUrl,
}: HeroSectionProps) {
  const shouldReduceMotion = usePrefersReducedMotion();

  // Animasi masuk halus 900ms (hanya pada nama pengantin & tanggal sesuai SSoT DESIGN.md)
  const fadeInVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.9,
        delay: shouldReduceMotion ? 0 : customDelay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <header
      className="relative min-h-screen w-full flex flex-col justify-between items-center text-center overflow-hidden bg-surakarta-bg-dark text-surakarta-fg-on-dark"
      aria-label="Sampul Pernikahan"
    >
      {/* Background Image Potret Sinematik Full-bleed */}
      <div className="absolute inset-0 z-0">
        <Image
          src={coverImageUrl}
          alt={`Potret sinematik ${brideName} & ${groomName}`}
          fill
          priority
          sizes="100vw"
          unoptimized
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-90 contrast-95"
        />
        {/* Lapisan Vignette Malam Wulung hangat */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-surakarta-bg-dark/70 via-surakarta-bg-dark/45 to-surakarta-bg-dark/90"
          aria-hidden="true"
        />
      </div>

      {/* Bagian Atas: Label Ucapan Santun Formal */}
      <div className="relative z-10 pt-16 md:pt-20 px-6 max-w-lg mx-auto">
        <motion.p
          custom={0.1}
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="text-xs md:text-sm font-body tracking-[0.06em] text-surakarta-gold-light uppercase"
        >
          Pernikahan
        </motion.p>
      </div>

      {/* Bagian Tengah: Judul H1 Nama Kedua Mempelai (Bodoni Moda Didone) */}
      <div className="relative z-10 px-6 max-w-2xl mx-auto my-auto py-8 space-y-4">
        <motion.div
          custom={0.25}
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-[0.95] text-surakarta-fg-on-dark drop-shadow-sm">
            <span>{brideName}</span>
            <span className="block my-2 text-3xl sm:text-4xl md:text-5xl font-display italic text-surakarta-gold font-normal">
              &
            </span>
            <span>{groomName}</span>
          </h1>
        </motion.div>

        {/* Tanggal & Lokasi Formal */}
        <motion.div
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="pt-4 space-y-1 font-body"
        >
          <p className="text-base md:text-lg text-surakarta-fg-on-dark font-normal tracking-wide">
            {weddingDateText}
          </p>
          <p className="text-xs md:text-sm text-surakarta-fg-muted-dark tracking-normal">
            {locationText}
          </p>
        </motion.div>
      </div>

      {/* Bagian Bawah: Indikator Gulir & Soft CSS Vignette Fade ke Latar Gading */}
      <div className="relative z-10 pb-10 px-6 flex flex-col items-center space-y-3">
        <motion.div
          custom={0.6}
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="flex flex-col items-center space-y-2 opacity-80"
        >
          <span className="text-xs font-body text-surakarta-fg-muted-dark tracking-wider">
            Gulir ke bawah
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-surakarta-gold to-transparent animate-pulse" />
        </motion.div>
      </div>

      {/* Transisi Gradasi Lembut ke Latar Gading Keraton (#F6F1E7) Seksi Berikutnya */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 md:h-36 bg-gradient-to-b from-transparent via-surakarta-bg/60 to-surakarta-bg pointer-events-none z-10"
        aria-hidden="true"
      />
    </header>
  );
}
