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
      const now = Date.now();
      const diff = targetTime - now;

      if (isNaN(targetTime) || diff <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          isMounted: true,
        };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
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
