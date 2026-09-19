
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { setupWebAudioMock } from '../mocks/audio-mock';

describe('Root Page Smoke Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupWebAudioMock();
  });

  it('renders editorial welcome heading and Surakarta ornaments', async () => {
    const pageComponent = await HomePage({ searchParams: Promise.resolve({}) });
    render(pageComponent);

    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeDefined();
    expect(mainHeading.textContent).toContain('Ananda');
    expect(mainHeading.textContent).toContain('Bagus');

    const separator = screen.getAllByRole('separator');
    expect(separator.length).toBeGreaterThanOrEqual(1);
  });

  it('renders VirtualEnvelope with personalized guest name from searchParams', async () => {
    const pageComponent = await HomePage({
      searchParams: Promise.resolve({ to: 'Bapak Raden Mas' }),
    });
    render(pageComponent);

    expect(screen.getAllByText('Bapak Raden Mas').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: 'Buka undangan' }).length).toBeGreaterThanOrEqual(2);
  });

  it('renders FloatingVinyl player controls', async () => {
    const pageComponent = await HomePage({ searchParams: Promise.resolve({}) });
    render(pageComponent);

    expect(screen.getByTestId('floating-vinyl-player')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Putar musik' })).toBeInTheDocument();
  });

  it('renders the Love Story timeline after the event schedule', async () => {
    const pageComponent = await HomePage({ searchParams: Promise.resolve({}) });
    render(pageComponent);

    const timeline = screen.getByRole('region', { name: 'Linimasa kisah cinta' });
    expect(timeline).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Kisah cinta kami' })).toBeInTheDocument();

    const eventSchedule = screen.getByRole('region', {
      name: 'Rangkaian Jadwal Acara dan Lokasi Venue',
    });
    expect(eventSchedule.compareDocumentPosition(timeline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders the cinematic photo gallery after the Love Story timeline', async () => {
    const pageComponent = await HomePage({ searchParams: Promise.resolve({}) });
    render(pageComponent);

    const gallery = screen.getByRole('region', { name: 'Galeri foto sinematik' });
    expect(gallery).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Galeri momen' })).toBeInTheDocument();

    const timeline = screen.getByRole('region', { name: 'Linimasa kisah cinta' });
    expect(timeline.compareDocumentPosition(gallery) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

