import React from 'react';
import { cn } from '@/lib/utils';

interface TruntumDividerProps {
  className?: string;
}

/**
 * Divider Ornamen Bunga Truntum
 * Garis simetris 1px dengan ikon bunga truntum Prada Emas (#C2A05B) di tengah sesuai SSoT DESIGN.md 5.3
 */
export function TruntumDivider({ className }: TruntumDividerProps) {
  return (
    <div
      role="separator"
      className={cn(
        'flex items-center justify-center gap-3 w-full py-2',
        className
      )}
    >
      {/* Garis Kiri */}
      <span className="h-px w-[72px] bg-surakarta-line-strong" />

      {/* Ikon Bunga Truntum Prada Emas */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-surakarta-gold shrink-0"
        aria-hidden="true"
      >
        <path
          d="M10 2L11.5 7.5L17 6L13 10.5L17 15L11.5 13.5L10 19L8.5 13.5L3 15L7 10.5L3 6L8.5 7.5L10 2Z"
          fill="currentColor"
        />
        <circle cx="10" cy="10.5" r="1.5" fill="#6B4423" />
      </svg>

      {/* Garis Kanan */}
      <span className="h-px w-[72px] bg-surakarta-line-strong" />
    </div>
  );
}
