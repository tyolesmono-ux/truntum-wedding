import { WeddingEventSession } from '@/lib/config/wedding-content';

/**
 * Mengonversi string tanggal ISO 8601 (misal 2026-12-12T01:00:00Z)
 * menjadi format UTC ISO ringkas RFC 5545 (20261212T010000Z).
 */
export function formatUtcCompact(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getUTCFullYear().toString().padStart(4, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Menghasilkan tautan Google Calendar web action untuk sesi acara.
 */
export function generateGoogleCalendarUrl(event: WeddingEventSession): string {
  const startUtc = formatUtcCompact(event.startIso);
  const endUtc = formatUtcCompact(event.endIso);

  const fullLocation = event.roomName
    ? `${event.venueName} (${event.roomName}), ${event.address}`
    : `${event.venueName}, ${event.address}`;

  const details = `${event.title} - Pernikahan Ananda Putri & Bagus Prasetyo\n\nLokasi: ${fullLocation}\nWaktu: ${event.date} (${event.timeRange})`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startUtc}/${endUtc}`,
    details: details,
    location: fullLocation,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Menghasilkan string payload berkas iCalendar RFC 5545 (.ics).
 */
export function generateIcsContent(event: WeddingEventSession): string {
  const startUtc = formatUtcCompact(event.startIso);
  const endUtc = formatUtcCompact(event.endIso);
  const nowUtc = formatUtcCompact(new Date().toISOString());

  const fullLocation = event.roomName
    ? `${event.venueName} (${event.roomName}), ${event.address}`
    : `${event.venueName}, ${event.address}`;

  const details = `${event.title} - Pernikahan Ananda Putri & Bagus Prasetyo. Waktu: ${event.date} (${event.timeRange})`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bespoke Luxury Digital Wedding//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}-20261212@truntum.wedding`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${fullLocation}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Pengingat Pernikahan Ananda & Bagus',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Mengunduh berkas iCalendar (.ics) di sisi klien melalui Data URI Blob.
 */
export function downloadIcsFile(filename: string, content: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
