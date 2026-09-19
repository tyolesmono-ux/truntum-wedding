import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surakarta: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          'surface-alt': 'var(--surface-alt)',
          'bg-dark': 'var(--bg-dark)',
          'surface-dark': 'var(--surface-dark)',
          fg: 'var(--fg)',
          'fg-body': 'var(--fg-body)',
          'fg-muted': 'var(--fg-muted)',
          'fg-on-dark': 'var(--fg-on-dark)',
          'fg-muted-dark': 'var(--fg-muted-dark)',
          brand: 'var(--brand)',
          'brand-soft': 'var(--brand-soft)',
          gold: 'var(--gold)',
          'gold-light': 'var(--gold-light)',
          accent: 'var(--accent)',
          success: 'var(--success)',
          line: 'var(--line)',
          'line-strong': 'var(--line-strong)',
          'line-dark': 'var(--line-dark)',
        },
      },
      fontFamily: {
        display: ['var(--font-bodoni)', 'serif'],
        body: ['var(--font-jost)', 'sans-serif'],
        arabic: ['var(--font-amiri)', 'serif'],
      },
      borderRadius: {
        DEFAULT: '2px',
        card: '4px',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
