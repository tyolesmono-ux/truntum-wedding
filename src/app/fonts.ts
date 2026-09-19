import { Bodoni_Moda, Jost, Amiri } from 'next/font/google';

/**
 * Bodoni Moda: Display Serif untuk Headings & Monogram (Didone High-Fashion)
 */
export const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bodoni',
  weight: '400',
  style: ['normal', 'italic'],
});

/**
 * Jost: Geometris Modern untuk Body, UI, Data Tabular, dan Label
 */
export const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
  weight: ['300', '400', '500'],
});

/**
 * Amiri: Kaligrafi Arab Al-Qur'an (Surat Ar-Rum 21 & Doa Sakral)
 */
export const amiri = Amiri({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-amiri',
  weight: '400',
});
