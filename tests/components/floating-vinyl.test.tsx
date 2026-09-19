import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FloatingVinyl } from '@/components/audio/FloatingVinyl';
import { AudioProvider, useAudio } from '@/contexts/AudioContext';
import { setupWebAudioMock } from '../mocks/audio-mock';

function TestVinylHarness() {
  const { unlockAndPlay } = useAudio();
  return (
    <div>
      <button data-testid="start-audio" onClick={() => void unlockAndPlay()}>
        Start
      </button>
      <FloatingVinyl />
    </div>
  );
}

function renderVinyl() {
  return render(
    <AudioProvider>
      <TestVinylHarness />
    </AudioProvider>
  );
}

describe('FloatingVinyl Player Component (SSoT DESIGN.md Section 6.2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupWebAudioMock();
  });

  it('renders with initial paused state and accessible aria-label "Putar musik"', () => {
    renderVinyl();

    const vinylBtn = screen.getByRole('button', { name: 'Putar musik' });
    expect(vinylBtn).toBeDefined();
    expect(vinylBtn.getAttribute('aria-pressed')).toBe('false');
    expect(vinylBtn.getAttribute('data-playing')).toBe('false');
  });

  it('toggles to "Jeda musik" and running rotation state when playing', async () => {
    const user = userEvent.setup();
    renderVinyl();

    // Start audio
    await user.click(screen.getByTestId('start-audio'));

    const vinylBtn = screen.getByRole('button', { name: 'Jeda musik' });
    expect(vinylBtn).toBeDefined();
    expect(vinylBtn.getAttribute('aria-pressed')).toBe('true');
    expect(vinylBtn.getAttribute('data-playing')).toBe('true');
  });

  it('toggles play/pause state when the vinyl button itself is clicked', async () => {
    const user = userEvent.setup();
    renderVinyl();

    const vinylBtn = screen.getByRole('button', { name: 'Putar musik' });
    await user.click(vinylBtn);

    expect(screen.getByRole('button', { name: 'Jeda musik' })).toBeDefined();

    await user.click(screen.getByRole('button', { name: 'Jeda musik' }));
    expect(screen.getByRole('button', { name: 'Putar musik' })).toBeDefined();
  });

  it('supports keyboard activation via Enter and Space keys', async () => {
    const user = userEvent.setup();
    renderVinyl();

    const vinylBtn = screen.getByRole('button', { name: 'Putar musik' });
    vinylBtn.focus();
    expect(document.activeElement).toBe(vinylBtn);

    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Jeda musik' })).toBeDefined();

    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'Putar musik' })).toBeDefined();
  });

  it('respects prefers-reduced-motion by disabling continuous rotation and displaying static indicator', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    renderVinyl();
    const vinylBtn = screen.getByRole('button', { name: 'Putar musik' });
    expect(vinylBtn.getAttribute('data-reduced-motion')).toBe('true');
    expect(screen.getByTestId('reduced-motion-indicator')).toBeInTheDocument();
  });
});
