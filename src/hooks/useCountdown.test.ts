import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './useCountdown';

describe('useCountdown hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates remaining days, hours, minutes, and seconds accurately', () => {
    // Tetapkan waktu sistem saat ini: 2026-12-01T00:00:00.000Z
    const mockNow = new Date('2026-12-01T00:00:00.000Z').getTime();
    vi.setSystemTime(mockNow);

    // Target: 2026-12-12T01:00:00.000Z (11 hari, 1 jam kemudian)
    const targetDate = '2026-12-12T01:00:00.000Z';

    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.isMounted).toBe(true);
    expect(result.current.isExpired).toBe(false);
    expect(result.current.days).toBe(11);
    expect(result.current.hours).toBe(1);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
  });

  it('updates remaining time every second', () => {
    const mockNow = new Date('2026-12-12T00:59:50.000Z').getTime();
    vi.setSystemTime(mockNow);

    const targetDate = '2026-12-12T01:00:00.000Z'; // 10 detik lagi

    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.seconds).toBe(10);

    // Majukan waktu 3 detik
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.seconds).toBe(7);
  });

  it('flags isExpired when the target date has passed', () => {
    const mockNow = new Date('2026-12-13T00:00:00.000Z').getTime();
    vi.setSystemTime(mockNow);

    const targetDate = '2026-12-12T01:00:00.000Z';

    const { result } = renderHook(() => useCountdown(targetDate));

    expect(result.current.isExpired).toBe(true);
    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
  });
});
