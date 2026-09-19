import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

describe('HeroSection component', () => {
  const defaultProps = {
    groomName: 'Bagus',
    brideName: 'Ananda',
    weddingDateText: 'Sabtu, 12 Desember 2026',
    locationText: 'Surakarta, Jawa Tengah',
    coverImageUrl: '/images/hero/cover-cinematic.webp',
  };

  it('renders couple names inside the primary h1 heading with Didone display typography', () => {
    render(<HeroSection {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('Ananda');
    expect(heading.textContent).toContain('Bagus');
  });

  it('renders formal wedding date and location text in sentence case', () => {
    render(<HeroSection {...defaultProps} />);

    expect(screen.getByText('Sabtu, 12 Desember 2026')).toBeInTheDocument();
    expect(screen.getByText('Surakarta, Jawa Tengah')).toBeInTheDocument();
  });

  it('renders the cover image with appropriate accessibility attributes', () => {
    render(<HeroSection {...defaultProps} />);

    const img = screen.getByRole('img', { name: /potret sinematik ananda & bagus/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/hero/cover-cinematic.webp');
  });

  it('renders subtle scroll cue in formal polite language', () => {
    render(<HeroSection {...defaultProps} />);

    expect(screen.getByText(/gulir ke bawah/i)).toBeInTheDocument();
  });
});
