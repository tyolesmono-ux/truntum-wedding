import type { Metadata } from 'next';
import { bodoniModa, jost, amiri } from '@/app/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bespoke Luxury Digital Wedding Invitation',
  description: 'Undangan pernikahan digital eksklusif dengan estetika editorial Surakarta.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${bodoniModa.variable} ${jost.variable} ${amiri.variable}`}
    >
      <body className="bg-surakarta-bg text-surakarta-fg font-body min-h-screen antialiased selection:bg-surakarta-gold selection:text-white">
        {children}
      </body>
    </html>
  );
}
