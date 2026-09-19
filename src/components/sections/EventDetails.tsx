'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WeddingEventSession } from '@/lib/config/wedding-content';
import { TruntumDivider } from '@/components/ornaments/TruntumDivider';
import { generateGoogleCalendarUrl, generateIcsContent, downloadIcsFile } from '@/lib/utils/calendar';
import { Calendar, MapPin, ExternalLink, Download } from 'lucide-react';

export interface EventDetailsProps {
  readonly events: readonly WeddingEventSession[];
}

interface EventCardProps {
  readonly event: WeddingEventSession;
}

function EventCard({ event }: EventCardProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCalendarOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCalendarOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  const handleDownloadIcs = () => {
    const icsContent = generateIcsContent(event);
    downloadIcsFile(`pernikahan-${event.id}`, icsContent);
    setIsCalendarOpen(false);
  };

  const googleCalendarUrl = generateGoogleCalendarUrl(event);

  return (
    <div className="bg-surakarta-surface border border-surakarta-line rounded-card p-6 sm:p-8 space-y-6 text-left shadow-xs">
      {/* Judul Sesi Acara & Waktu */}
      <div className="space-y-2 border-b border-surakarta-line/60 pb-5">
        <span className="font-body text-xs tracking-widest text-surakarta-brand-soft uppercase font-medium">
          Rangkaian Acara
        </span>
        <h3 className="font-display text-2xl sm:text-3xl text-surakarta-fg tracking-tight">
          {event.title}
        </h3>
        <p className="font-body text-base text-surakarta-fg-body font-normal">
          {event.date}
        </p>
        <p className="font-body text-sm text-surakarta-brand font-medium">
          {event.timeRange}
        </p>
      </div>

      {/* Rincian Lokasi Venue */}
      <div className="space-y-2">
        <div className="flex items-start space-x-2.5">
          <MapPin className="w-4 h-4 text-surakarta-brand-soft shrink-0 mt-1" aria-hidden="true" />
          <div className="font-body">
            <h4 className="text-base font-medium text-surakarta-fg">
              {event.venueName}
              {event.roomName && (
                <span className="text-surakarta-fg-muted font-normal"> ({event.roomName})</span>
              )}
            </h4>
            <p className="text-xs sm:text-sm text-surakarta-fg-body pt-1 leading-relaxed max-w-lg">
              {event.address}
            </p>
          </div>
        </div>
      </div>

      {/* Tombol Interaktif: Tambah ke Kalender & Navigasi Peta */}
      <div className="pt-2 flex flex-wrap gap-3 items-center relative">
        {/* Tombol Tambah ke Kalender */}
        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            aria-expanded={isCalendarOpen}
            aria-label={`Tambah ke kalender untuk ${event.title}`}
            className="inline-flex items-center space-x-2 h-11 px-4 text-xs sm:text-sm font-body font-medium rounded-sm border border-surakarta-line-strong bg-transparent text-surakarta-brand hover:bg-surakarta-surface-alt/40 transition-colors focus:outline-none focus:ring-2 focus:ring-surakarta-gold focus:ring-offset-2"
          >
            <Calendar className="w-4 h-4 text-surakarta-brand-soft" aria-hidden="true" />
            <span>Tambah ke kalender</span>
          </button>

          {/* Popover Pilihan Kalender */}
          {isCalendarOpen && (
            <div
              role="dialog"
              aria-label="Pilihan kalender"
              className="absolute left-0 bottom-full mb-2 z-20 w-64 bg-surakarta-surface border border-surakarta-line rounded-card shadow-md p-2 space-y-1"
            >
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsCalendarOpen(false)}
                className="flex items-center space-x-2 w-full px-3 py-2 text-xs font-body text-surakarta-fg hover:bg-surakarta-surface-alt rounded-sm transition-colors text-left"
              >
                <ExternalLink className="w-3.5 h-3.5 text-surakarta-brand-soft shrink-0" aria-hidden="true" />
                <span>Buka Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className="flex items-center space-x-2 w-full px-3 py-2 text-xs font-body text-surakarta-fg hover:bg-surakarta-surface-alt rounded-sm transition-colors text-left"
              >
                <Download className="w-3.5 h-3.5 text-surakarta-brand-soft shrink-0" aria-hidden="true" />
                <span>Unduh berkas kalender (.ics)</span>
              </button>
            </div>
          )}
        </div>

        {/* Tombol Buka Peta Venue (Google Maps) */}
        <a
          href={event.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka Google Maps untuk ${event.title}`}
          className="inline-flex items-center space-x-2 h-11 px-4 text-xs sm:text-sm font-body font-medium rounded-sm border border-surakarta-line-strong bg-transparent text-surakarta-brand hover:bg-surakarta-surface-alt/40 transition-colors focus:outline-none focus:ring-2 focus:ring-surakarta-gold focus:ring-offset-2"
        >
          <MapPin className="w-4 h-4 text-surakarta-brand-soft" aria-hidden="true" />
          <span>Buka peta venue</span>
        </a>

        {/* Opsi Navigasi Waze Alternatif */}
        {event.wazeUrl && (
          <a
            href={event.wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Buka Waze untuk ${event.title}`}
            className="inline-flex items-center space-x-1.5 text-xs font-body text-surakarta-fg-muted hover:text-surakarta-brand transition-colors underline underline-offset-4 py-2"
          >
            <span>Buka di Waze</span>
          </a>
        )}
      </div>
    </div>
  );
}

export function EventDetails({ events }: EventDetailsProps) {
  return (
    <section
      role="region"
      aria-label="Rangkaian Jadwal Acara dan Lokasi Venue"
      className="relative py-24 md:py-32 px-6 bg-surakarta-surface text-surakarta-fg overflow-hidden"
    >
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header Seksi (Left-aligned sesuai SSoT DESIGN.md) */}
        <div className="space-y-3 text-left">
          <span className="font-body text-xs md:text-sm tracking-[0.08em] text-surakarta-brand-soft uppercase font-medium">
            Agenda Resmi
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-surakarta-fg tracking-tight">
            Waktu & Tempat Acara
          </h2>
          <p className="font-body text-sm md:text-base text-surakarta-fg-body leading-relaxed">
            Kehadiran serta doa restu Bapak/Ibu/Saudara sekalian merupakan kehormatan dan kebahagiaan yang tak terhingga bagi kami sekeluarga.
          </p>
        </div>

        {/* Daftar Kartu Acara dengan Pemisah Truntum */}
        <div className="space-y-10">
          {events.map((event, index) => (
            <React.Fragment key={event.id}>
              {index > 0 && <TruntumDivider className="my-8 w-full max-w-sm mx-auto" />}
              <EventCard event={event} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
