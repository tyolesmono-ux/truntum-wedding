'use client';

import React from 'react';
import { motion } from 'motion/react';
import { KawungBackground } from '@/components/ornaments/KawungBackground';
import { TruntumDivider } from '@/components/ornaments/TruntumDivider';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export interface IslamicQuotesProps {
  readonly arabicText: string;
  readonly translation: string;
  readonly surahReference: string;
  readonly blessingDuah: string;
}

export function IslamicQuotes({
  arabicText,
  translation,
  surahReference,
  blessingDuah,
}: IslamicQuotesProps) {
  const shouldReduceMotion = usePrefersReducedMotion();

  const staggerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      role="region"
      aria-label="Ayat Suci dan Doa Pernikahan"
      className="relative py-24 md:py-32 px-6 bg-surakarta-bg text-surakarta-fg overflow-hidden text-center"
    >
      {/* Tekstur Halus Motif Kawung 5% dengan Radial Mask */}
      <KawungBackground />

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        {/* Ornamen Garis Gunungan Halus & Referensi Surah */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerVariants}
          className="flex flex-col items-center space-y-3"
        >
          {/* Siluet Ikon Gunungan Minimalis Prada */}
          <svg
            className="w-8 h-10 text-surakarta-gold opacity-80"
            viewBox="0 0 32 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 2 L28 20 C28 32 24 38 16 38 C8 38 4 32 4 20 Z" />
            <path d="M16 2 L16 38" strokeDasharray="2 2" />
            <circle cx="16" cy="18" r="3" fill="currentColor" stroke="none" opacity="0.6" />
          </svg>

          <p className="font-body text-xs md:text-sm tracking-[0.08em] text-surakarta-brand-soft uppercase font-medium">
            {surahReference}
          </p>
        </motion.div>

        {/* Teks Kaligrafi Arab Al-Qur'an (Font Amiri) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerVariants}
          className="px-2"
        >
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-2xl sm:text-3xl md:text-4xl leading-[2.3] md:leading-[2.5] text-surakarta-brand text-center tracking-normal drop-shadow-sm select-text"
          >
            <span className="text-surakarta-gold text-3xl md:text-4xl align-middle mr-1">﴿</span>
            {arabicText}
            <span className="text-surakarta-gold text-3xl md:text-4xl align-middle ml-1">﴾</span>
          </p>
        </motion.div>

        {/* Terjemahan Puitis Bahasa Indonesia */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerVariants}
          className="max-w-xl mx-auto"
        >
          <p className="font-body text-sm md:text-base text-surakarta-fg-body leading-relaxed md:leading-loose italic">
            &ldquo;{translation}&rdquo;
          </p>
        </motion.div>

        {/* Divider Truntum */}
        <TruntumDivider className="my-6" />

        {/* Doa Berkah Pernikahan (Sunnah) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerVariants}
          className="max-w-lg mx-auto bg-surakarta-surface/80 border border-surakarta-line rounded-card p-6 shadow-sm backdrop-blur-xs"
        >
          <p className="font-body text-xs tracking-wider text-surakarta-brand-soft uppercase mb-2 font-medium">
            Doa Pengantin
          </p>
          <p className="font-body text-sm md:text-base text-surakarta-fg-body leading-relaxed whitespace-pre-line">
            {blessingDuah}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
