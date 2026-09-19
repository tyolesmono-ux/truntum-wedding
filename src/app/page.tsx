import React from 'react';
import { KawungBackground } from '@/components/ornaments/KawungBackground';
import { TruntumDivider } from '@/components/ornaments/TruntumDivider';
import { VirtualEnvelope } from '@/components/opening/VirtualEnvelope';
import { FloatingVinyl } from '@/components/audio/FloatingVinyl';
import { AudioProvider } from '@/contexts/AudioContext';

interface PageProps {
  searchParams?: Promise<{ to?: string }>;
}

export default async function HomePage(props: PageProps) {
  const resolvedSearchParams = props.searchParams ? await props.searchParams : undefined;
  let guestName = 'Tamu Undangan';

  if (resolvedSearchParams?.to) {
    try {
      const decoded = decodeURIComponent(resolvedSearchParams.to).trim();
      if (decoded) {
        guestName = decoded;
      }
    } catch {
      guestName = 'Tamu Undangan';
    }
  }

  return (
    <AudioProvider>
      {/* Opening Gate: 3D Virtual Envelope Overlay */}
      <VirtualEnvelope guestName={guestName} />

      {/* Floating Audio Controller */}
      <FloatingVinyl />

      {/* Main Content Flow */}
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
    </AudioProvider>
  );
}
