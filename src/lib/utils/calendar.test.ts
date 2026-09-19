import { describe, it, expect, vi } from 'vitest';
import {
  generateGoogleCalendarUrl,
  generateIcsContent,
  formatUtcCompact,
  downloadIcsFile,
} from './calendar';
import { WeddingEventSession } from '@/lib/config/wedding-content';

const mockEvent: WeddingEventSession = {
  id: 'akad',
  title: 'Akad Nikah Ananda & Bagus',
  date: 'Sabtu, 12 Desember 2026',
  timeRange: '08:00 – 10:00 WIB',
  startIso: '2026-12-12T01:00:00Z',
  endIso: '2026-12-12T03:00:00Z',
  venueName: 'Sasana Handrawina',
  roomName: 'Pendhapa Ageng',
  address: 'Jl. Baluwarti No. 1, Surakarta',
  googleMapsUrl: 'https://maps.google.com/?q=Keraton+Surakarta',
  wazeUrl: 'https://waze.com/ul?q=Keraton+Surakarta',
};

describe('calendar utility', () => {
  describe('formatUtcCompact', () => {
    it('converts ISO 8601 string to compact RFC 5545 format', () => {
      expect(formatUtcCompact('2026-12-12T01:00:00Z')).toBe('20261212T010000Z');
      expect(formatUtcCompact('2026-12-12T03:30:45.000Z')).toBe('20261212T033045Z');
    });
  });

  describe('generateGoogleCalendarUrl', () => {
    it('generates a valid Google Calendar web URL with encoded query parameters', () => {
      const url = generateGoogleCalendarUrl(mockEvent);
      const parsedUrl = new URL(url);

      expect(parsedUrl.origin + parsedUrl.pathname).toBe('https://calendar.google.com/calendar/render');
      expect(parsedUrl.searchParams.get('action')).toBe('TEMPLATE');
      expect(parsedUrl.searchParams.get('text')).toBe('Akad Nikah Ananda & Bagus');
      expect(parsedUrl.searchParams.get('dates')).toBe('20261212T010000Z/20261212T030000Z');
      expect(parsedUrl.searchParams.get('location')).toBe('Sasana Handrawina (Pendhapa Ageng), Jl. Baluwarti No. 1, Surakarta');
      expect(parsedUrl.searchParams.get('details')).toContain('Pernikahan Ananda Putri & Bagus Prasetyo');
    });
  });

  describe('generateIcsContent', () => {
    it('generates a valid RFC 5545 iCalendar payload', () => {
      const ics = generateIcsContent(mockEvent);

      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('VERSION:2.0');
      expect(ics).toContain('PRODID:-//Bespoke Luxury Digital Wedding//ID');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('UID:akad-20261212@truntum.wedding');
      expect(ics).toContain('DTSTART:20261212T010000Z');
      expect(ics).toContain('DTEND:20261212T030000Z');
      expect(ics).toContain('SUMMARY:Akad Nikah Ananda & Bagus');
      expect(ics).toContain('LOCATION:Sasana Handrawina (Pendhapa Ageng), Jl. Baluwarti No. 1, Surakarta');
      expect(ics).toContain('BEGIN:VALARM');
      expect(ics).toContain('TRIGGER:-PT2H');
      expect(ics).toContain('END:VALARM');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('END:VCALENDAR');
    });
  });

  describe('downloadIcsFile', () => {
    it('creates a temporary blob link and triggers click in DOM environment', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const clickMock = vi.fn();
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = originalCreateElement(tagName);
        if (tagName === 'a') {
          el.click = clickMock;
        }
        return el;
      });

      downloadIcsFile('akad-nikah', 'BEGIN:VCALENDAR\nEND:VCALENDAR');

      expect(createObjectURLMock).toHaveBeenCalledTimes(1);
      expect(clickMock).toHaveBeenCalledTimes(1);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
    });
  });
});
