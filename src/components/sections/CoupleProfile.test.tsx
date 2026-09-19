import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CoupleProfile } from './CoupleProfile';
import { WeddingPerson } from '@/lib/config/wedding-content';

describe('CoupleProfile component', () => {
  const mockGroom: WeddingPerson = {
    fullName: 'Bagus Prasetyo, S.T.',
    shortName: 'Bagus',
    title: 'Putra Pertama',
    fatherName: 'Bapak Dr. Bambang Sudiro',
    motherName: 'Ibu Sri Wahyuni',
    photoUrl: '/images/couple/groom.webp',
    instagramHandle: 'bagusprasetyo',
    role: 'groom',
  };

  const mockBride: WeddingPerson = {
    fullName: 'Ananda Putri, M.Ds.',
    shortName: 'Ananda',
    title: 'Putri Kedua',
    fatherName: 'Bapak Ir. H. Raden Mas Hendro',
    motherName: 'Ibu Hj. Siti Aminah',
    photoUrl: '/images/couple/bride.webp',
    instagramHandle: 'anandaputri',
    role: 'bride',
  };

  it('renders groom and bride full names, titles, and lineage', () => {
    render(<CoupleProfile groom={mockGroom} bride={mockBride} />);

    expect(screen.getByText('Bagus Prasetyo, S.T.')).toBeInTheDocument();
    expect(screen.getByText('Ananda Putri, M.Ds.')).toBeInTheDocument();
    expect(screen.getByText(/Bapak Dr. Bambang Sudiro/)).toBeInTheDocument();
    expect(screen.getByText(/Ibu Sri Wahyuni/)).toBeInTheDocument();
    expect(screen.getByText(/Bapak Ir. H. Raden Mas Hendro/)).toBeInTheDocument();
    expect(screen.getByText(/Ibu Hj. Siti Aminah/)).toBeInTheDocument();
  });

  it('renders portrait photos with ogee arch styling and alt text', () => {
    render(<CoupleProfile groom={mockGroom} bride={mockBride} />);

    const groomImg = screen.getByRole('img', { name: /potret bagus prasetyo/i });
    const brideImg = screen.getByRole('img', { name: /potret ananda putri/i });

    expect(groomImg).toBeInTheDocument();
    expect(brideImg).toBeInTheDocument();
    expect(groomImg).toHaveAttribute('src', '/images/couple/groom.webp');
    expect(brideImg).toHaveAttribute('src', '/images/couple/bride.webp');
  });

  it('renders instagram links when handles are provided', () => {
    render(<CoupleProfile groom={mockGroom} bride={mockBride} />);

    const groomIgLink = screen.getByRole('link', { name: /instagram @bagusprasetyo/i });
    const brideIgLink = screen.getByRole('link', { name: /instagram @anandaputri/i });

    expect(groomIgLink).toHaveAttribute('href', 'https://instagram.com/bagusprasetyo');
    expect(brideIgLink).toHaveAttribute('href', 'https://instagram.com/anandaputri');
    expect(groomIgLink).toHaveAttribute('target', '_blank');
  });

  it('has semantic region role and accessible label', () => {
    render(<CoupleProfile groom={mockGroom} bride={mockBride} />);

    expect(screen.getByRole('region', { name: /profil kedua mempelai/i })).toBeInTheDocument();
  });
});
