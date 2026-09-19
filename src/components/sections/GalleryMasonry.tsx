'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Maximize2 } from 'lucide-react';
import { GalleryPhoto } from '@/lib/config/wedding-content';
import { cn } from '@/lib/utils';

const LightboxModal = dynamic(
  () => import('@/components/sections/LightboxModal').then((mod) => mod.LightboxModal),
  { ssr: false }
);

export interface GalleryMasonryProps {
  readonly photos: readonly GalleryPhoto[];
  readonly className?: string;
}

/**
 * Seksi 3.8 Galeri Foto Sinematik: spread editorial asimetris di atas Malam Wulung.
 * Foto lanskap 16:9 membentang penuh, foto potret 3:4 berpasangan dua kolom tanpa
 * gutter, radius 0, sehingga tidak ada celah tepi luar.
 */
export function GalleryMasonry({ photos, className }: GalleryMasonryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <section
      aria-label="Galeri foto sinematik"
      className={cn('relative bg-surakarta-bg-dark py-20 sm:py-28', className)}
    >
      <header className="mx-auto max-w-xl space-y-3 px-6 pb-10 sm:max-w-2xl sm:pb-14">
        <p className="font-body text-xs sm:text-sm text-surakarta-fg-muted-dark">Dokumentasi kami</p>
        <h2 className="font-display text-3xl sm:text-4xl text-surakarta-fg-on-dark tracking-tight">
          Galeri momen
        </h2>
      </header>

      {/* Spread asimetris full-bleed: tanpa padding samping dan tanpa gutter */}
      <div data-testid="gallery-grid" className="grid grid-cols-2">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            data-testid="photo-frame"
            onClick={() => {
              setActiveIndex(index);
              setIsLightboxOpen(true);
            }}
            aria-label={`Buka foto: ${photo.alt}`}
            className={cn(
              'relative block w-full bg-surakarta-surface-alt text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-surakarta-gold',
              photo.aspectRatio === 'landscape' && 'col-span-2'
            )}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes={photo.aspectRatio === 'landscape' ? '100vw' : '50vw'}
              unoptimized={photo.src.endsWith('.svg')}
              placeholder={photo.blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={photo.blurDataUrl}
              className="w-full h-auto"
            />

            {/* Penanda bahwa foto dapat diketuk untuk diperbesar */}
            <span
              data-testid="photo-zoom-hint"
              aria-hidden="true"
              className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-sm bg-surakarta-bg-dark text-surakarta-gold-light"
            >
              <Maximize2 className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>

      <LightboxModal
        isOpen={isLightboxOpen}
        activeIndex={activeIndex}
        photos={photos}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}
