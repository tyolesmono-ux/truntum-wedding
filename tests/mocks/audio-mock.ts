import { vi } from 'vitest';

export interface MockGainNode {
  gain: {
    value: number;
    setValueAtTime: ReturnType<typeof vi.fn>;
    linearRampToValueAtTime: ReturnType<typeof vi.fn>;
    exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
  };
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

export interface MockAudioContext {
  currentTime: number;
  state: 'suspended' | 'running' | 'closed';
  resume: ReturnType<typeof vi.fn>;
  suspend: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
  createMediaElementSource: ReturnType<typeof vi.fn>;
  createGain: ReturnType<typeof vi.fn>;
  destination: { channelCount: number };
}

let activeAudioContext: MockAudioContext | null = null;
let activeGainNode: MockGainNode | null = null;

export function getActiveAudioContext(): MockAudioContext | null {
  return activeAudioContext;
}

export function getActiveGainNode(): MockGainNode | null {
  return activeGainNode;
}

export function createMockGainNode(): MockGainNode {
  const gainNode: MockGainNode = {
    gain: {
      value: 1,
      setValueAtTime: vi.fn((val: number) => {
        gainNode.gain.value = val;
      }),
      linearRampToValueAtTime: vi.fn((val: number) => {
        gainNode.gain.value = val;
      }),
      exponentialRampToValueAtTime: vi.fn((val: number) => {
        gainNode.gain.value = val;
      }),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
  activeGainNode = gainNode;
  return gainNode;
}

export function createMockAudioContext(): MockAudioContext {
  const ctx: MockAudioContext = {
    currentTime: 0,
    state: 'suspended',
    resume: vi.fn().mockImplementation(async () => {
      ctx.state = 'running';
    }),
    suspend: vi.fn().mockImplementation(async () => {
      ctx.state = 'suspended';
    }),
    close: vi.fn().mockImplementation(async () => {
      ctx.state = 'closed';
    }),
    createMediaElementSource: vi.fn().mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
    }),
    createGain: vi.fn().mockImplementation(() => createMockGainNode()),
    destination: { channelCount: 2 },
  };
  activeAudioContext = ctx;
  return ctx;
}

export function setupWebAudioMock() {
  activeAudioContext = null;
  activeGainNode = null;

  // Mock AudioContext and webkitAudioContext
  const AudioContextMock = vi.fn().mockImplementation(() => createMockAudioContext());
  (window as unknown as { AudioContext: unknown }).AudioContext = AudioContextMock;
  (window as unknown as { webkitAudioContext: unknown }).webkitAudioContext = AudioContextMock;

  // Mock HTMLMediaElement play & pause on prototype
  window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(async () => {
    return Promise.resolve();
  });
  window.HTMLMediaElement.prototype.pause = vi.fn().mockImplementation(() => {
    // pause no-op
  });

  // Default visibilityState
  Object.defineProperty(document, 'visibilityState', {
    value: 'visible',
    writable: true,
    configurable: true,
  });
}

export function simulateVisibilityChange(state: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', {
    value: state,
    writable: true,
    configurable: true,
  });
  document.dispatchEvent(new Event('visibilitychange'));
}
