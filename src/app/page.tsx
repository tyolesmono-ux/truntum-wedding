import React from 'react';
import { KawungBackground } from '@/components/ornaments/KawungBackground';
import { TruntumDivider } from '@/components/ornaments/TruntumDivider';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Background motif Kawung */}
      <KawungBackground />

      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-display text-surakarta-fg leading-tight">
          Bespoke Luxury Digital Wedding Invitation
        </h1>

        <TruntumDivider className="my-4" />

        <p className="text-surakarta-fg-body font-body text-base max-w-md mx-auto leading-relaxed">
          Fondasi sistem desain, perancah kode Next.js 15, dan aset budaya Surakarta siap digunakan untuk fase berikutnya.
        </p>
      </div>
    </main>
  );
}
