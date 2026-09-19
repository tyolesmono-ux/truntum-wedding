import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventDetails } from './EventDetails';
import { WeddingEventSession } from '@/lib/config/wedding-content';

describe('EventDetails component', () => {
  const mockEvents: readonly WeddingEventSession[] = [
    {
      id: 'akad',
      title: 'Akad Nikah',
      date: 'Sabtu, 12 Desember 2026',
      timeRange: '08:00 – 10:00 WIB',
      startIso: '2026-12-12T01:00:00Z',
      endIso: '2026-12-12T03:00:00Z',
      venueName: 'Sasana Handrawina',
      roomName: 'Pendhapa Ageng',
      address: 'Jl. Baluwarti No. 1, Surakarta',
      googleMapsUrl: 'https://maps.google.com/?q=Keraton+Surakarta',
      wazeUrl: 'https://waze.com/ul?q=Keraton+Surakarta',
    },
    {
      id: 'resepsi',
      title: 'Resepsi Pernikahan',
      date: 'Sabtu, 12 Desember 2026',
      timeRange: '11:00 – 14:00 WIB',
      startIso: '2026-12-12T04:00:00Z',
      endIso: '2026-12-12T07:00:00Z',
      venueName: 'Sasana Handrawina',
      roomName: 'Ballroom Utama',
      address: 'Jl. Baluwarti No. 1, Surakarta',
      googleMapsUrl: 'https://maps.google.com/?q=Keraton+Surakarta',
      wazeUrl: 'https://waze.com/ul?q=Keraton+Surakarta',
    },
  ];

  it('renders all event sessions with dates, time, and venues', () => {
    render(<EventDetails events={mockEvents} />);

    expect(screen.getByText('Akad Nikah')).toBeInTheDocument();
    expect(screen.getByText('Resepsi Pernikahan')).toBeInTheDocument();
    expect(screen.getByText('08:00 – 10:00 WIB')).toBeInTheDocument();
    expect(screen.getByText('11:00 – 14:00 WIB')).toBeInTheDocument();
    expect(screen.getAllByText(/Sasana Handrawina/)).toHaveLength(2);
  });

  it('toggles calendar options popover when "Tambah ke kalender" is clicked', () => {
    render(<EventDetails events={mockEvents} />);

    const addCalButtons = screen.getAllByRole('button', { name: /tambah ke kalender/i });
    expect(addCalButtons.length).toBe(2);

    // Klik tombol kalender pada sesi Akad
    fireEvent.click(addCalButtons[0]);

    // Opsi Google Calendar dan Apple .ics harus muncul
    expect(screen.getByText(/buka google calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/unduh berkas kalender/i)).toBeInTheDocument();
  });

  it('renders direct navigation links for Google Maps and Waze', () => {
    render(<EventDetails events={mockEvents} />);

    const mapLinks = screen.getAllByRole('link', { name: /buka google maps/i });
    expect(mapLinks.length).toBe(2);
    expect(mapLinks[0]).toHaveAttribute('href', 'https://maps.google.com/?q=Keraton+Surakarta');
    expect(mapLinks[0]).toHaveAttribute('target', '_blank');
  });

  it('closes calendar popover when Escape key is pressed or clicked outside', () => {
    render(<EventDetails events={mockEvents} />);

    const addCalButtons = screen.getAllByRole('button', { name: /tambah ke kalender/i });
    fireEvent.click(addCalButtons[0]);
    expect(screen.getByRole('dialog', { name: /pilihan kalender/i })).toBeInTheDocument();

    // Tekan tombol Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /pilihan kalender/i })).not.toBeInTheDocument();

    // Buka kembali dan klik di luar
    fireEvent.click(addCalButtons[0]);
    expect(screen.getByRole('dialog', { name: /pilihan kalender/i })).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('dialog', { name: /pilihan kalender/i })).not.toBeInTheDocument();
  });

  it('has semantic region role and accessible label', () => {
    render(<EventDetails events={mockEvents} />);

    expect(screen.getByRole('region', { name: /rangkaian jadwal acara dan lokasi venue/i })).toBeInTheDocument();
  });
});
