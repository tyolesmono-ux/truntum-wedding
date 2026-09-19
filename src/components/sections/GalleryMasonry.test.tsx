import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GalleryMasonry } from './GalleryMasonry';
import { GalleryPhoto } from '@/lib/config/wedding-content';

const mockPhotos: readonly GalleryPhoto[] = [
  {
    id: 'gallery-01',
    src: '/images/gallery/gallery-01-momen-berdua.svg',
    alt: 'Bagus dan Ananda berfoto berdua di pelataran keraton Surakarta',
    width: 1200,
    height: 675,
    aspectRatio: 'landscape',
    caption: 'Momen berdua di pelataran keraton.',
  },
  {
    id: 'gallery-02',
    src: '/images/gallery/gallery-02-potret-tradisional.svg',
    alt: 'Potret Ananda mengenakan busana tradisional Solo',
    width: 900,
    height: 1200,
    aspectRatio: 'portrait',
    caption: 'Busana tradisional Solo dalam balutan batik sogan.',
  },
  {
    id: 'gallery-03',
    src: '/images/gallery/gallery-03-detail-batik.svg',
    alt: 'Detail selendang batik sogan dan aksesori pengantin wanita',
    width: 900,
    height: 1200,
    aspectRatio: 'portrait',
    caption: 'Detail selendang batik sogan dan aksesori.',
  },
];

describe('GalleryMasonry component', () => {
  it('renders a labelled region on the Malam Wulung dark surface', () => {
    render(<GalleryMasonry photos={mockPhotos} />);

    const section = screen.getByRole('region', { name: /galeri foto sinematik/i });
    expect(section.className).toContain('bg-surakarta-bg-dark');
    expect(screen.getByRole('heading', { name: 'Galeri momen' })).toBeInTheDocument();
  });

  it('renders every photo as a button with an accessible Indonesian label', () => {
    render(<GalleryMasonry photos={mockPhotos} />);

    mockPhotos.forEach((photo) => {
      expect(screen.getByRole('button', { name: `Buka foto: ${photo.alt}` })).toBeInTheDocument();
    });
  });

  it('spreads landscape photos full-width and pairs portraits in two ungapped columns', () => {
    const { container } = render(<GalleryMasonry photos={mockPhotos} />);

    const grid = screen.getByTestId('gallery-grid');
    expect(grid.className).toContain('grid-cols-2');
    expect(grid.className).not.toContain('px-');
    expect(grid.className).not.toContain('gap-');

    const buttons = container.querySelectorAll('button[aria-label^="Buka foto:"]');
    expect(buttons[0].className).toContain('col-span-2');
    expect(buttons[1].className).not.toContain('col-span-2');
    expect(buttons[2].className).not.toContain('col-span-2');
  });

  it('reserves intrinsic image dimensions and a Kertas Batik placeholder to keep CLS at zero', () => {
    render(<GalleryMasonry photos={mockPhotos} />);

    mockPhotos.forEach((photo) => {
      const img = screen.getByRole('img', { name: photo.alt });
      expect(img).toHaveAttribute('width', String(photo.width));
      expect(img).toHaveAttribute('height', String(photo.height));
      expect(img).toHaveAttribute('src', photo.src);
    });

    const wrappers = screen.getAllByTestId('photo-frame');
    wrappers.forEach((wrapper) => expect(wrapper.className).toContain('bg-surakarta-surface-alt'));
  });

  it('indicates that every photo can be tapped to enlarge', () => {
    render(<GalleryMasonry photos={mockPhotos} />);

    expect(screen.getAllByTestId('photo-zoom-hint')).toHaveLength(mockPhotos.length);
  });

  it('keeps the lightbox unmounted until a photo is tapped', () => {
    render(<GalleryMasonry photos={mockPhotos} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the lightbox modal when a photo card is tapped', async () => {
    render(<GalleryMasonry photos={mockPhotos} />);

    const buttons = screen.getAllByRole('button', { name: /^Buka foto:/ });
    fireEvent.click(buttons[1]);

    const dialog = await screen.findByRole('dialog', { name: /pratinjau foto resolusi penuh/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('02 / 03')).toBeInTheDocument();
  });
});
