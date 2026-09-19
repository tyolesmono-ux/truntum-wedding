import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { VirtualEnvelope } from '@/components/opening/VirtualEnvelope';
import { AudioProvider } from '@/contexts/AudioContext';
import { setupWebAudioMock, getActiveAudioContext, getActiveGainNode } from '../mocks/audio-mock';


function renderEnvelope(props = {}) {
  return render(
    <AudioProvider>
      <VirtualEnvelope {...props} />
    </AudioProvider>
  );
}

describe('VirtualEnvelope Component (SSoT DESIGN.md Section 6.1 & Motion)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupWebAudioMock();
    document.body.style.overflow = '';
  });

  it('renders formal etiquette label and personal guest name', () => {
    renderEnvelope({ guestName: 'Bapak Ahmad & Keluarga' });

    expect(screen.getByText('Kepada Bapak/Ibu/Saudara')).toBeDefined();
    expect(screen.getAllByText('Bapak Ahmad & Keluarga').length).toBeGreaterThanOrEqual(1);
  });

  it('falls back to "Tamu Undangan" when guestName is empty or missing', () => {
    const { rerender } = renderEnvelope();
    expect(screen.getAllByText('Tamu Undangan').length).toBeGreaterThanOrEqual(1);

    rerender(
      <AudioProvider>
        <VirtualEnvelope guestName="   " />
      </AudioProvider>
    );
    expect(screen.getAllByText('Tamu Undangan').length).toBeGreaterThanOrEqual(1);
  });


  it('locks body scroll when envelope is mounted', () => {
    const { unmount } = renderEnvelope();
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('renders both WaxSeal and formal "Buka undangan" button', () => {
    renderEnvelope();

    const buttons = screen.getAllByRole('button', { name: 'Buka undangan' });
    // Expect two triggers: wax seal and primary CTA button
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('triggers opening sequence and invokes onOpened when CTA button is clicked', async () => {
    vi.useFakeTimers();
    const handleOpened = vi.fn();
    renderEnvelope({ onOpened: handleOpened });

    const ctaButton = screen.getByTestId('envelope-cta-button');
    expect(ctaButton).toBeDefined();

    await act(async () => {
      ctaButton.click();
      vi.advanceTimersByTime(2000);
    });

    expect(handleOpened).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('triggers opening sequence when WaxSeal is clicked', async () => {
    vi.useFakeTimers();
    const handleOpened = vi.fn();
    renderEnvelope({ onOpened: handleOpened });

    const sealBtn = screen.getByTestId('envelope-wax-seal');
    expect(sealBtn).toBeDefined();

    await act(async () => {
      sealBtn.click();
      vi.advanceTimersByTime(2000);
    });

    expect(handleOpened).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('unlocks Web Audio API and initiates 2.5s volume ramp upon opening interaction', async () => {
    vi.useFakeTimers();
    renderEnvelope();

    const sealBtn = screen.getByTestId('envelope-wax-seal');

    await act(async () => {
      sealBtn.click();
      vi.advanceTimersByTime(2000);
    });

    const ctx = getActiveAudioContext();
    expect(ctx?.resume).toHaveBeenCalled();

    const gain = getActiveGainNode();
    expect(gain?.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.8, expect.any(Number));
    vi.useRealTimers();
  });
});


