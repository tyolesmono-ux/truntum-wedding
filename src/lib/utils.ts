import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Menggabungkan nama kelas CSS kondisional dengan deduplikasi konflik Tailwind CSS.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
