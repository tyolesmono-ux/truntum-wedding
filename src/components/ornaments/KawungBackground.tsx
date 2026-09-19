import React from 'react';
import { cn } from '@/lib/utils';

interface KawungBackgroundProps {
  className?: string;
}

/**
 * Pola Latar Geometris Batik Kawung Solo
 * Opasitas 5% Sogan Tua dengan radial gradient mask sesuai SSoT DESIGN.md 5.2
 */
export function KawungBackground({ className }: KawungBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden select-none',
        className
      )}
      style={{
        maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 78%)',
      }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="kawung-pattern"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke="#6B4423" strokeWidth="1" opacity="0.05">
              <ellipse cx="32" cy="16" rx="13" ry="15" />
              <ellipse cx="32" cy="48" rx="13" ry="15" />
              <ellipse cx="16" cy="32" rx="15" ry="13" />
              <ellipse cx="48" cy="32" rx="15" ry="13" />
              <circle cx="32" cy="32" r="2.5" fill="#6B4423" stroke="none" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kawung-pattern)" />
      </svg>
    </div>
  );
}
