import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AudioProvider, useAudio } from '@/contexts/AudioContext';
import {
  setupWebAudioMock,
  getActiveAudioContext,
  getActiveGainNode,
  simulateVisibilityChange,
} from '../mocks/audio-mock';

function TestAudioConsumer() {
  const { isPlaying, isMuted, isUnlocked, unlockAndPlay, togglePlay, toggleMute } = useAudio();

  return (
    <div>
      <div data-testid="status-playing">{isPlaying ? 'playing' : 'paused'}</div>
      <div data-testid="status-muted">{isMuted ? 'muted' : 'unmuted'}</div>
      <div data-testid="status-unlocked">{isUnlocked ? 'unlocked' : 'locked'}</div>
      <button onClick={() => void unlockAndPlay()} data-testid="btn-unlock">
        Unlock & Play
      </button>
      <button onClick={togglePlay} data-testid="btn-toggle-play">
        Toggle Play
      </button>
      <button onClick={toggleMute} data-testid="btn-toggle-mute">
        Toggle Mute
      </button>
    </div>
  );
}

describe('Web Audio API Engine & AudioProvider (SSoT & Autoplay Policy Compliance)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupWebAudioMock();
  });

  it('throws an error if useAudio is called outside of AudioProvider', () => {
    // Suppress console.error during expected thrown error in render
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestAudioConsumer />)).toThrowError(
      'useAudio must be used within an AudioProvider'
    );
    consoleSpy.mockRestore();
  });

  it('NEVER autoplays or resumes AudioContext on initial mount', () => {
    render(
      <AudioProvider>
        <TestAudioConsumer />
      </AudioProvider>
    );

    expect(screen.getByTestId('status-playing').textContent).toBe('paused');
    expect(screen.getByTestId('status-unlocked').textContent).toBe('locked');
    expect(window.HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

    const ctx = getActiveAudioContext();
    if (ctx) {
      expect(ctx.state).toBe('suspended');
      expect(ctx.resume).not.toHaveBeenCalled();
    }
  });

  it('unlocks AudioContext, plays audio, and executes 2.5s linear volume ramp to 0.8 upon physical gesture', async () => {
    const user = userEvent.setup();
    render(
      <AudioProvider>
        <TestAudioConsumer />
      </AudioProvider>
    );

    const unlockBtn = screen.getByTestId('btn-unlock');
    await user.click(unlockBtn);

    expect(screen.getByTestId('status-unlocked').textContent).toBe('unlocked');
    expect(screen.getByTestId('status-playing').textContent).toBe('playing');

    const ctx = getActiveAudioContext();
    expect(ctx).not.toBeNull();
    expect(ctx?.resume).toHaveBeenCalled();

    const gain = getActiveGainNode();
    expect(gain).not.toBeNull();
    expect(gain?.gain.setValueAtTime).toHaveBeenCalledWith(0.0001, expect.any(Number));
    expect(gain?.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.8, expect.any(Number));
  });

  it('pauses audio when document is hidden and auto-resumes when tab becomes visible again', async () => {
    const user = userEvent.setup();
    render(
      <AudioProvider>
        <TestAudioConsumer />
      </AudioProvider>
    );

    await user.click(screen.getByTestId('btn-unlock'));
    expect(screen.getByTestId('status-playing').textContent).toBe('playing');

    // Simulate switching away from tab
    act(() => {
      simulateVisibilityChange('hidden');
    });
    expect(screen.getByTestId('status-playing').textContent).toBe('paused');

    // Simulate returning to tab
    act(() => {
      simulateVisibilityChange('visible');
    });
    expect(screen.getByTestId('status-playing').textContent).toBe('playing');
  });

  it('does NOT auto-resume on visible if user manually paused before switching tabs', async () => {
    const user = userEvent.setup();
    render(
      <AudioProvider>
        <TestAudioConsumer />
      </AudioProvider>
    );

    await user.click(screen.getByTestId('btn-unlock'));
    expect(screen.getByTestId('status-playing').textContent).toBe('playing');

    // User explicitly pauses
    await user.click(screen.getByTestId('btn-toggle-play'));
    expect(screen.getByTestId('status-playing').textContent).toBe('paused');

    // Tab hidden then visible
    act(() => {
      simulateVisibilityChange('hidden');
    });
    act(() => {
      simulateVisibilityChange('visible');
    });

    // Should remain paused!
    expect(screen.getByTestId('status-playing').textContent).toBe('paused');
  });

  it('toggles play/pause with micro-fade on togglePlay button click', async () => {
    const user = userEvent.setup();
    render(
      <AudioProvider>
        <TestAudioConsumer />
      </AudioProvider>
    );

    await user.click(screen.getByTestId('btn-unlock'));
    expect(screen.getByTestId('status-playing').textContent).toBe('playing');

    // Pause toggle
    await user.click(screen.getByTestId('btn-toggle-play'));
    expect(screen.getByTestId('status-playing').textContent).toBe('paused');

    // Resume toggle
    await user.click(screen.getByTestId('btn-toggle-play'));
    expect(screen.getByTestId('status-playing').textContent).toBe('playing');
  });

  it('toggles mute status and updates gain node value', async () => {
    const user = userEvent.setup();
    render(
      <AudioProvider>
        <TestAudioConsumer />
      </AudioProvider>
    );

    await user.click(screen.getByTestId('btn-unlock'));
    expect(screen.getByTestId('status-muted').textContent).toBe('unmuted');

    await user.click(screen.getByTestId('btn-toggle-mute'));
    expect(screen.getByTestId('status-muted').textContent).toBe('muted');

    await user.click(screen.getByTestId('btn-toggle-mute'));
    expect(screen.getByTestId('status-muted').textContent).toBe('unmuted');
  });
});
