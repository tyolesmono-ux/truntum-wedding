import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LightboxModal } from './LightboxModal';
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

interface RenderOptions {
  readonly isOpen?: boolean;
  readonly activeIndex?: number;
}

function renderLightbox({ isOpen = true, activeIndex = 0 }: RenderOptions = {}) {
  const onClose = vi.fn();
  const onNavigate = vi.fn();
  render(
    <LightboxModal
      isOpen={isOpen}
      activeIndex={activeIndex}
      photos={mockPhotos}
      onClose={onClose}
      onNavigate={onNavigate}
    />
  );
  return { onClose, onNavigate };
}

describe('LightboxModal component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('renders nothing while closed', () => {
    renderLightbox({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('opens an accessible dialog with the tabular counter, close control, and caption bar', () => {
    renderLightbox({ activeIndex: 1 });

    const dialog = screen.getByRole('dialog', { name: /pratinjau foto resolusi penuh/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('02 / 03')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tutup pratinjau foto/i })).toBeInTheDocument();
    expect(screen.getByText('Busana tradisional Solo dalam balutan batik sogan.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: mockPhotos[1].alt })).toBeInTheDocument();
  });

  it('locks background scrolling while open and releases it when closed', () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    const { rerender } = render(
      <LightboxModal
        isOpen
        activeIndex={0}
        photos={mockPhotos}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <LightboxModal
        isOpen={false}
        activeIndex={0}
        photos={mockPhotos}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on Escape, the close control, and a backdrop tap', () => {
    const first = renderLightbox();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(first.onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /tutup pratinjau foto/i }));
    expect(first.onClose).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('dialog'));
    expect(first.onClose).toHaveBeenCalledTimes(3);
  });

  it('navigates with the arrow keys and clamps at the first and last photo', () => {
    const { onNavigate } = renderLightbox({ activeIndex: 0 });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNavigate).toHaveBeenCalledWith(1);

    const last = renderLightbox({ activeIndex: 2 });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(last.onNavigate).toHaveBeenCalledWith(2);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(last.onNavigate).toHaveBeenCalledWith(1);
  });

  it('navigates with horizontal touch swipes', () => {
    const { onNavigate } = renderLightbox({ activeIndex: 1 });
    const stage = screen.getByTestId('lightbox-stage');

    fireEvent.touchStart(stage, { touches: [{ clientX: 300, clientY: 200 }] });
    fireEvent.touchMove(stage, { touches: [{ clientX: 200, clientY: 205 }] });
    fireEvent.touchEnd(stage);
    expect(onNavigate).toHaveBeenCalledWith(2);

    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchMove(stage, { touches: [{ clientX: 320, clientY: 198 }] });
    fireEvent.touchEnd(stage);
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it('dismisses on a downward swipe and toggles zoom on a double tap', () => {
    const { onClose } = renderLightbox({ activeIndex: 1 });
    const stage = screen.getByTestId('lightbox-stage');

    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchMove(stage, { touches: [{ clientX: 203, clientY: 360 }] });
    fireEvent.touchEnd(stage);
    expect(onClose).toHaveBeenCalledTimes(1);

    const image = screen.getByTestId('lightbox-image');
    expect(image).toHaveAttribute('data-zoomed', 'false');
    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(stage);
    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(stage);
    expect(screen.getByTestId('lightbox-image')).toHaveAttribute('data-zoomed', 'true');
  });

  it('closes on clicking the backdrop stage outside child elements', () => {
    const { onClose } = renderLightbox({ activeIndex: 0 });
    const stage = screen.getByTestId('lightbox-stage');

    fireEvent.click(stage);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('resets zoomed state when navigating to another photo', () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    const { rerender } = render(
      <LightboxModal
        isOpen
        activeIndex={0}
        photos={mockPhotos}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    );
    const stage = screen.getByTestId('lightbox-stage');

    // Double tap to zoom
    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(stage);
    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(stage);
    expect(screen.getByTestId('lightbox-image')).toHaveAttribute('data-zoomed', 'true');

    // Navigate to next photo
    rerender(
      <LightboxModal
        isOpen
        activeIndex={1}
        photos={mockPhotos}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    );
    expect(screen.getByTestId('lightbox-image')).toHaveAttribute('data-zoomed', 'false');
  });

  it('suppresses horizontal swipe navigation while zoomed', () => {
    const { onNavigate } = renderLightbox({ activeIndex: 1 });
    const stage = screen.getByTestId('lightbox-stage');

    // Double tap to zoom
    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(stage);
    fireEvent.touchStart(stage, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchEnd(stage);
    expect(screen.getByTestId('lightbox-image')).toHaveAttribute('data-zoomed', 'true');

    // Attempt swipe navigation
    fireEvent.touchStart(stage, { touches: [{ clientX: 300, clientY: 200 }] });
    fireEvent.touchMove(stage, { touches: [{ clientX: 100, clientY: 200 }] });
    fireEvent.touchEnd(stage);

    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('traps Tab focus within the modal controls', () => {
    renderLightbox({ activeIndex: 1 });
    const closeBtn = screen.getByRole('button', { name: /tutup pratinjau foto/i });
    const prevBtn = screen.getByRole('button', { name: /foto sebelumnya/i });
    const nextBtn = screen.getByRole('button', { name: /foto berikutnya/i });

    // Focus close button and press Tab -> should advance to prevBtn
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(prevBtn).toBeInTheDocument();

    // Focus last button and press Tab -> should wrap to first button
    nextBtn.focus();
    expect(document.activeElement).toBe(nextBtn);
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(closeBtn);

    // Focus first button and press Shift+Tab -> should wrap to last button
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(nextBtn);
  });

  it('does not close the modal when clicking directly on the image', () => {
    const { onClose } = renderLightbox({ activeIndex: 0 });
    const img = screen.getByRole('img', { name: mockPhotos[0].alt });

    fireEvent.click(img);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('navigates when clicking the desktop chevron navigation buttons', () => {
    const { onNavigate } = renderLightbox({ activeIndex: 1 });
    const nextBtn = screen.getByRole('button', { name: /foto berikutnya/i });
    const prevBtn = screen.getByRole('button', { name: /foto sebelumnya/i });

    fireEvent.click(nextBtn);
    expect(onNavigate).toHaveBeenCalledWith(2);

    fireEvent.click(prevBtn);
    expect(onNavigate).toHaveBeenCalledWith(0);
  });
});
