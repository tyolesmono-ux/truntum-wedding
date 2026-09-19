import React from 'react';
import { VirtualEnvelope } from '@/components/opening/VirtualEnvelope';
import { FloatingVinyl } from '@/components/audio/FloatingVinyl';
import { AudioProvider } from '@/contexts/AudioContext';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { HeroSection } from '@/components/sections/HeroSection';
import { IslamicQuotes } from '@/components/sections/IslamicQuotes';
import { CoupleProfile } from '@/components/sections/CoupleProfile';
import { CountdownSection } from '@/components/sections/CountdownSection';
import { EventDetails } from '@/components/sections/EventDetails';
import { LoveStoryTimeline } from '@/components/sections/LoveStoryTimeline';
import { GalleryMasonry } from '@/components/sections/GalleryMasonry';
import { WEDDING_CONTENT_CONFIG } from '@/lib/config/wedding-content';

interface PageProps {
  searchParams?: Promise<{ to?: string }>;
}

export default async function HomePage(props: PageProps) {
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  let guestName = 'Tamu Undangan';

  if (searchParams?.to) {
    try {
      guestName = decodeURIComponent(searchParams.to).trim() || 'Tamu Undangan';
    } catch {
      // Keep formal fallback if URI is malformed
    }
  }

  const { couple, quote, hero, events, countdownTargetDate, loveStory, gallery } =
    WEDDING_CONTENT_CONFIG;

  return (
    <AudioProvider>
      <SmoothScrollProvider>
        {/* Opening Gate: 3D Virtual Envelope Overlay */}
        <VirtualEnvelope guestName={guestName} />

        {/* Floating Audio Controller */}
        <FloatingVinyl />

        {/* Main Editorial Flow */}
        <main className="relative min-h-screen bg-surakarta-bg">
          {/* 3.2 Hero Cover Sinematik */}
          <HeroSection
            groomName={couple.groom.shortName}
            brideName={couple.bride.shortName}
            weddingDateText={hero.dateFormal}
            locationText={hero.locationCity}
            coverImageUrl={hero.coverImageUrl}
          />

          {/* 3.3 Ayat Suci Al-Qur'an & Doa Sakral */}
          <IslamicQuotes
            arabicText={quote.arabicText}
            translation={quote.translation}
            surahReference={`${quote.surahName}: ${quote.ayahNumber}`}
            blessingDuah={quote.blessingDuah}
          />

          {/* 3.4 Profil Kedua Mempelai */}
          <CoupleProfile
            groom={couple.groom}
            bride={couple.bride}
          />

          {/* 3.5 Hitung Mundur Hari Bahagia */}
          <CountdownSection
            targetDate={countdownTargetDate}
          />

          {/* 3.6 Rangkaian Jadwal Acara & Lokasi Venue */}
          <EventDetails
            events={events}
          />

          {/* 3.7 Linimasa Kisah Cinta Sinematik */}
          <LoveStoryTimeline
            milestones={loveStory}
          />

          {/* 3.8 Galeri Foto Sinematik & Lightbox */}
          <GalleryMasonry
            photos={gallery}
          />
        </main>
      </SmoothScrollProvider>
    </AudioProvider>
  );
}
