'use client';

import React, { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { LoveStoryMilestone } from '@/lib/config/wedding-content';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

export interface LoveStoryTimelineProps {
  readonly milestones: readonly LoveStoryMilestone[];
  readonly className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function MilestoneItem({
  milestone,
  reduceMotion,
}: {
  readonly milestone: LoveStoryMilestone;
  readonly reduceMotion: boolean;
}) {
  const titleId = `milestone-title-${milestone.id}`;

  return (
    <motion.article
      aria-labelledby={titleId}
      initial={reduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={itemVariants}
      className="relative pl-0"
    >
      {/* Titik penanda konsentris Prada Emas pada rel kiri */}
      <span
        data-testid="milestone-node"
        aria-hidden="true"
        className="absolute left-[-2.5rem] sm:left-[-3.5rem] top-1.5 -translate-x-1/2 flex h-3 w-3 items-center justify-center rounded-full border border-surakarta-gold bg-surakarta-bg-dark"
      >
        <span className="h-1 w-1 rounded-full bg-surakarta-gold" />
      </span>

      <time
        dateTime={milestone.year}
        className="block font-display text-2xl sm:text-3xl text-surakarta-gold-light tracking-tight"
      >
        {milestone.year}
      </time>
      <p className="pt-1 font-body text-xs sm:text-sm text-surakarta-fg-muted-dark">
        {milestone.period}
      </p>
      <h3
        id={titleId}
        className="pt-3 font-display text-[22px] sm:text-2xl text-surakarta-fg-on-dark leading-snug"
      >
        {milestone.title}
      </h3>
      <p className="pt-3 font-body text-sm sm:text-base text-surakarta-fg-on-dark leading-relaxed">
        {milestone.story}
      </p>
    </motion.article>
  );
}

/**
 * Seksi 3.7 Linimasa Kisah Cinta: rel vertikal kiri berlatar Malam Wulung dengan
 * garis progres Prada Emas yang terisi mengikuti pengguliran layar (GPU scaleY,
 * bukan height, agar tidak memicu reflow).
 */
export function LoveStoryTimeline({ milestones, className }: LoveStoryTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });

  return (
    <section
      aria-label="Linimasa kisah cinta"
      data-reduced-motion={shouldReduceMotion ? 'true' : 'false'}
      className={cn(
        'relative bg-surakarta-bg-dark text-surakarta-fg-on-dark py-24 sm:py-32 overflow-hidden',
        className
      )}
    >
      {/* Transisi gradasi lembut dari seksi terang sebelumnya menuju Malam Wulung */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-surakarta-surface to-transparent pointer-events-none"
      />

      <div className="relative z-10 max-w-xl sm:max-w-2xl mx-auto px-6">
        <header className="space-y-3 pb-12 sm:pb-16">
          <p className="font-body text-xs sm:text-sm text-surakarta-fg-muted-dark">
            Perjalanan kami
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-surakarta-fg-on-dark tracking-tight">
            Kisah cinta kami
          </h2>
          <p className="font-body text-sm sm:text-base text-surakarta-fg-muted-dark leading-relaxed">
            Setiap babak kami rawat sebagai doa, dari pertemuan pertama hingga janji yang akan
            kami ikrarkan.
          </p>
        </header>

        <div ref={timelineRef} className="relative pl-10 sm:pl-14">
          {/* Rel statis */}
          <div
            data-testid="timeline-rail"
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-px bg-surakarta-line-dark"
          />
          {/* Garis progres emas terikat pengguliran */}
          <motion.div
            role="progressbar"
            aria-label="Progres kisah cinta"
            aria-valuemin={0}
            aria-valuemax={100}
            data-static={shouldReduceMotion ? 'true' : 'false'}
            style={{ scaleY: shouldReduceMotion ? 1 : scrollYProgress }}
            className="absolute left-0 top-0 bottom-0 w-px origin-top bg-surakarta-gold"
          />

          <div className="space-y-16 sm:space-y-20">
            {milestones.map((milestone) => (
              <MilestoneItem
                key={milestone.id}
                milestone={milestone}
                reduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
