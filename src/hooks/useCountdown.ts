import { useState, useEffect } from 'react';

export interface CountdownState {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly isExpired: boolean;
  readonly isMounted: boolean;
}

const DEFAULT_STATE: CountdownState = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isExpired: false,
  isMounted: false,
};

/**
 * Custom hook untuk menghitung waktu mundur menuju target tanggal ISO 8601.
 * Dilengkapi pelindung hidrasi (isMounted) untuk stabilitas rendering di Next.js 15 SSR.
 */
export function useCountdown(targetIsoDate: string): CountdownState {
  const [state, setState] = useState<CountdownState>(DEFAULT_STATE);

  useEffect(() => {
    function calculate(): CountdownState {
      const targetTime = new Date(targetIsoDate).getTime();
      const diff = isNaN(targetTime) ? 0 : targetTime - Date.now();
      const remaining = Math.max(0, diff);

      return {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000),
        isExpired: diff <= 0,
        isMounted: true,
      };
    }

    // Hitung seketika saat terpasang
    setState(calculate());

    // Interval pembaharuan setiap detik
    const timerId = setInterval(() => {
      setState(calculate());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [targetIsoDate]);

  return state;
}
