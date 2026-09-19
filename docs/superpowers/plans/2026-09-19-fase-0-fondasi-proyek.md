# Fase 0: Fondasi Proyek, Dependensi & Desain Sistem Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menyiapkan perancah kode (*scaffolding*) Next.js 15 App Router, konfigurasi TypeScript mode ketat, instalasi dependensi terverifikasi, tokenisasi desain sistem Surakarta, tipografi Google Fonts (*Bodoni Moda*, *Jost*, *Amiri*), ornamen vektor Jawa (Kawung & Truntum), serta *test harness* Vitest + React Testing Library.

**Architecture:** Menggunakan Next.js 15.1 App Router dengan React 19 dalam arsitektur *mobile-first* 60 FPS. Konfigurasi CSS variables berbasis palet Surakarta (*Gading Keraton*, *Malam Wulung*, *Prada Emas*, *Sogan Tua*) dan Google Fonts (*Bodoni Moda*, *Jost*, *Amiri* subset). Membangun harness Vitest + React Testing Library dengan siklus TDD ketat untuk memvalidasi utilitas, token warna, tipografi, dan ornamen visual sebelum integrasi ke Root Layout.

**Tech Stack:** Next.js 15.1.0, React 19.0.0, TypeScript 5.6.3, Tailwind CSS 3.4.13, PostCSS 8.4.47, Vitest 2.1.1, React Testing Library 16.0.1, jsdom 25.0.1, Motion (`motion` 11.11.7), Lenis 1.1.14, Zod 3.23.8, DOMPurify (`isomorphic-dompurify` 2.16.0).

**Spec:** [`ROADMAP_PENGERJAAN.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/ROADMAP_PENGERJAAN.md) (Fase 0), [`TECH_STACK.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/TECH_STACK.md), [`DESIGN.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/DESIGN.md), [`CODING_STANDARD.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/CODING_STANDARD.md)

## Global Constraints

- **Strict Credential Protection**: Dilarang keras membaca, membuat, atau menampilkan berkas rahasia (`.env`, `.env.local`, `*.pem`, `*.key`). Gunakan hanya `.env.example`.
- **Palet Warna Surakarta Wajib**: `--bg` (`#F6F1E7`), `--surface` (`#FCFAF5`), `--surface-alt` (`#E8DCC8`), `--bg-dark` (`#15120F`), `--surface-dark` (`#221D18`), `--fg` (`#231F1B`), `--fg-body` (`#4A3E33`), `--fg-muted` (`#8A7862`), `--brand` (`#6B4423`), `--gold` (`#C2A05B`), `--accent` (`#8C2F27`), `--line` (`#E0D3BC`), `--line-strong` (`#C9B896`).
- **Prada Emas Rule**: Maksimal 5% dari total area layar; dilarang keras digunakan sebagai warna teks body.
- **Tipografi Eksklusif 3 Font**: *Bodoni Moda* (Display $\ge 22\text{px}$), *Jost* (Body & UI), *Amiri* (Khusus kaligrafi Arab Al-Qur'an $\le 30\text{ KB}$). Dilarang menggunakan font kaligrafi latin/script/handwriting.
- **Sentence Case**: Seluruh label tombol dan teks antarmuka wajib *sentence case* (misal: "Buka undangan", bukan "BUKA UNDANGAN").
- **TypeScript Strictness**: `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`, nol toleransi untuk tipe `any`.
- **Target Performa**: Mobile-first 60 FPS (viewport 390×844), bundle JS awal $\le 90\text{ KB}$ gzipped.
- **Testing Standard**: 100% kelulusan unit test Vitest pada setiap tugas.

---

### Task 1: Scaffolding Proyek, Dependensi & Konfigurasi TypeScript Ketat

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `.env.example`

**Interfaces:**
- Consumes: Node.js LTS (^20.x / 24.x), pnpm (^9.x / 11.x)
- Produces: Basis konfigurasi compiler TypeScript, PostCSS pipeline, dan matriks dependensi terverifikasi

- [x] **Step 1: Tulis berkas `package.json` dan `.env.example`**

Tulis konfigurasi `package.json` persis sesuai spesifikasi [`TECH_STACK.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/TECH_STACK.md#3-package-dependencies-specification):

```json
{
  "name": "luxury-wedding-invitation",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.1",
    "@supabase/supabase-js": "^2.45.4",
    "canvas-confetti": "^1.9.3",
    "clsx": "^2.1.1",
    "isomorphic-dompurify": "^2.16.0",
    "lenis": "^1.1.14",
    "lucide-react": "^0.446.0",
    "motion": "^11.11.7",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.5.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/canvas-confetti": "^1.9.0",
    "@types/node": "^20.16.11",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.3",
    "vitest": "^2.1.1"
  }
}
```

Tulis berkas `.env.example`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cloudflare Turnstile Anti-Bot
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAA...
TURNSTILE_SECRET_KEY=0x4AAAAAA...

# Canonical Domain URL
NEXT_PUBLIC_SITE_URL=https://theweddingof-anandabagus.com

# Optional Internal Administrative Secret
WEDDING_ADMIN_SECRET=wedding_secret_token_123
```

- [x] **Step 2: Jalankan `pnpm install` dan verifikasi lockfile**

Run: `pnpm install`  
Expected: Instalasi selesai dengan `pnpm-lock.yaml` terbuat tanpa error dependensi.

- [x] **Step 3: Tulis `tsconfig.json` dan `postcss.config.mjs`**

Tulis `tsconfig.json` dengan konfigurasi ketat sesuai [`CODING_STANDARD.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/CODING_STANDARD.md#31-strict-configuration):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Tulis `postcss.config.mjs`:

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

- [x] **Step 4: Jalankan verifikasi TypeScript**

Run: `pnpm typecheck`  
Expected: `tsc --noEmit` berhasil tanpa error kompilasi.

- [x] **Step 5: Commit scaffolding**

```bash
git add package.json pnpm-lock.yaml tsconfig.json postcss.config.mjs .env.example
git commit -m "chore(setup): initialize Next.js 15 project scaffolding and strict typescript configuration"
```

---

### Task 2: Harness Pengujian Otomatis (Vitest & Testing Library)

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Consumes: `@testing-library/react`, `@testing-library/jest-dom`, `vitest`
- Produces: Test runner siap pakai dengan dukungan JSX, DOM rendering, path alias `@/*`, dan custom DOM matchers

- [x] **Step 1: Tulis failing smoke test `tests/smoke.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';

describe('Project Test Harness Smoke Test', () => {
  it('validates environment baseline and jest-dom matchers', () => {
    const rootElement = document.createElement('div');
    rootElement.setAttribute('data-testid', 'test-node');
    rootElement.textContent = 'Bespoke Luxury Digital Wedding Invitation';
    document.body.appendChild(rootElement);

    expect(rootElement).toBeInTheDocument();
    expect(rootElement).toHaveTextContent('Bespoke Luxury Digital Wedding Invitation');
  });
});
```

- [x] **Step 2: Jalankan test untuk memverifikasi kegagalan karena konfigurasi Vitest belum ada**

Run: `pnpm test`  
Expected: FAIL atau error "No test suite found / configuration file not found".

- [x] **Step 3: Tulis `vitest.config.ts` dan `vitest.setup.ts`**

Tulis `vitest.setup.ts`:

```typescript
import '@testing-library/jest-dom/vitest';
```

Tulis `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [x] **Step 4: Jalankan test untuk memverifikasi kelulusan**

Run: `pnpm test`  
Expected: PASS 1 test passed (100% success rate).

- [x] **Step 5: Commit test harness**

```bash
git add vitest.config.ts vitest.setup.ts tests/smoke.test.ts
git commit -m "test(setup): configure Vitest and React Testing Library environment"
```

---

### Task 3: Modul Utilitas Styling Inti (`src/lib/utils.ts`)

**Files:**
- Create: `src/lib/utils.ts`
- Test: `tests/lib/utils.test.ts`

**Interfaces:**
- Consumes: `clsx`, `tailwind-merge`
- Produces: `export function cn(...inputs: ClassValue[]): string`

- [x] **Step 1: Tulis failing unit test `tests/lib/utils.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utility cn()', () => {
  it('combines multiple class names correctly', () => {
    const result = cn('bg-sand', 'text-wulung');
    expect(result).toBe('bg-sand text-wulung');
  });

  it('handles conditional and falsy values', () => {
    const result = cn('base-class', false && 'hidden', null, undefined, 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('merges conflicting Tailwind utility classes properly via tailwind-merge', () => {
    const result = cn('px-4 py-2 text-sm', 'px-6 text-lg');
    expect(result).toBe('py-2 px-6 text-lg');
  });
});
```

- [x] **Step 2: Jalankan test untuk memastikan kegagalan (Red)**

Run: `pnpm test tests/lib/utils.test.ts`  
Expected: FAIL dengan error "Cannot find module '@/lib/utils'".

- [x] **Step 3: Implementasikan `src/lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Menggabungkan nama kelas CSS kondisional dengan deduplikasi konflik Tailwind CSS.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [x] **Step 4: Jalankan test untuk memastikan kelulusan (Green)**

Run: `pnpm test tests/lib/utils.test.ts`  
Expected: PASS (semua 3 assertion lulus).

- [x] **Step 5: Commit**

```bash
git add src/lib/utils.ts tests/lib/utils.test.ts
git commit -m "feat(utils): implement cn styling helper using clsx and tailwind-merge"
```

---

### Task 4: Token Desain Surakarta, CSS Variables & Tailwind CSS Theme

**Files:**
- Create: `src/app/globals.css`
- Create: `tailwind.config.ts`
- Test: `tests/tokens/design-tokens.test.ts`

**Interfaces:**
- Consumes: SSoT [`DESIGN.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/DESIGN.md) & [`TECH_STACK.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/TECH_STACK.md)
- Produces: CSS variables resmi Surakarta di `globals.css` dan integrasi token ke utilitas Tailwind (`bg-surakarta-bg`, `text-surakarta-gold`, `font-display`, `font-body`, `font-arabic`, dll.)

- [x] **Step 1: Tulis failing unit test `tests/tokens/design-tokens.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Design Tokens & Surakarta Palette Integrity', () => {
  it('defines all required CSS variables in globals.css according to SSoT', () => {
    const cssPath = path.resolve(__dirname, '../../src/app/globals.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    // Cek surfaces tokens
    expect(cssContent).toContain('--bg: #F6F1E7;');
    expect(cssContent).toContain('--surface: #FCFAF5;');
    expect(cssContent).toContain('--surface-alt: #E8DCC8;');
    expect(cssContent).toContain('--bg-dark: #15120F;');
    expect(cssContent).toContain('--surface-dark: #221D18;');

    // Cek typography tokens
    expect(cssContent).toContain('--fg: #231F1B;');
    expect(cssContent).toContain('--fg-body: #4A3E33;');
    expect(cssContent).toContain('--fg-muted: #8A7862;');
    expect(cssContent).toContain('--fg-on-dark: #EFE6D6;');

    // Cek brand & accents tokens
    expect(cssContent).toContain('--brand: #6B4423;');
    expect(cssContent).toContain('--brand-soft: #B07D4A;');
    expect(cssContent).toContain('--gold: #C2A05B;');
    expect(cssContent).toContain('--gold-light: #D9BE85;');
    expect(cssContent).toContain('--accent: #8C2F27;');
    expect(cssContent).toContain('--success: #7E8C74;');

    // Cek divider tokens
    expect(cssContent).toContain('--line: #E0D3BC;');
    expect(cssContent).toContain('--line-strong: #C9B896;');
  });

  it('maps CSS variables in tailwind.config.ts correctly', () => {
    const configPath = path.resolve(__dirname, '../../tailwind.config.ts');
    expect(fs.existsSync(configPath)).toBe(true);

    const configContent = fs.readFileSync(configPath, 'utf-8');
    expect(configContent).toContain("fontFamily");
    expect(configContent).toContain("var(--font-bodoni)");
    expect(configContent).toContain("var(--font-jost)");
    expect(configContent).toContain("var(--font-amiri)");
    expect(configContent).toContain("var(--bg)");
    expect(configContent).toContain("var(--gold)");
    expect(configContent).toContain("var(--brand)");
  });
});
```

- [x] **Step 2: Jalankan test untuk memastikan kegagalan (Red)**

Run: `pnpm test tests/tokens/design-tokens.test.ts`  
Expected: FAIL karena berkas belum ada.

- [x] **Step 3: Implementasikan `src/app/globals.css` dan `tailwind.config.ts`**

Tulis `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Surfaces (SSoT DESIGN.md) */
  --bg: #F6F1E7;          /* Gading Keraton / Latar Utama */
  --surface: #FCFAF5;     /* Melati / Kartu, Modal, Surat */
  --surface-alt: #E8DCC8; /* Kertas Batik / Permukaan Amplop */
  --bg-dark: #15120F;     /* Malam Wulung / Latar Gelap & Galeri */
  --surface-dark: #221D18;/* Permukaan Malam */

  /* Typography */
  --fg: #231F1B;          /* Wulung / Heading & Teks Utama */
  --fg-body: #4A3E33;     /* Teks Body Halus */
  --fg-muted: #8A7862;    /* Teks Muted */
  --fg-on-dark: #EFE6D6;  /* Teks Gading di Latar Gelap */

  /* Brand & Accents */
  --brand: #6B4423;       /* Sogan Tua / Brand, Tombol Utama */
  --brand-soft: #B07D4A;  /* Sogan Muda / Garis Sekunder */
  --gold: #C2A05B;        /* Prada Emas / Ornamen, Wax Seal */
  --gold-light: #D9BE85;  /* Prada Terang / Label di Latar Gelap */
  --accent: #8C2F27;      /* Cinde / Lilin Segel, Error */
  --success: #7E8C74;     /* Gadung Mlati / Status Sukses */

  /* Dividers & Borders */
  --line: #E0D3BC;        /* Border Lembut */
  --line-strong: #C9B896; /* Border Tegas & Garis Truntum */
}

@layer base {
  body {
    background-color: var(--bg);
    color: var(--fg);
    font-family: var(--font-jost), sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-bodoni), serif;
  }
}
```

Tulis `tailwind.config.ts`:

```typescript
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
          brand: 'var(--brand)',
          'brand-soft': 'var(--brand-soft)',
          gold: 'var(--gold)',
          'gold-light': 'var(--gold-light)',
          accent: 'var(--accent)',
          success: 'var(--success)',
          line: 'var(--line)',
          'line-strong': 'var(--line-strong)',
        },
      },
      fontFamily: {
        display: ['var(--font-bodoni)', 'serif'],
        body: ['var(--font-jost)', 'sans-serif'],
        arabic: ['var(--font-amiri)', 'serif'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
        lg: '6px',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [x] **Step 4: Jalankan test untuk memastikan kelulusan (Green)**

Run: `pnpm test tests/tokens/design-tokens.test.ts`  
Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add src/app/globals.css tailwind.config.ts tests/tokens/design-tokens.test.ts
git commit -m "feat(design): configure Surakarta editorial tokens and tailwind theme"
```

---

### Task 5: Integrasi Tipografi Google Fonts (`src/app/fonts.ts`)

**Files:**
- Create: `src/app/fonts.ts`
- Test: `tests/fonts/fonts.test.ts`

**Interfaces:**
- Consumes: `next/font/google` (*Bodoni Moda*, *Jost*, *Amiri*)
- Produces: `export const bodoniModa`, `export const jost`, `export const amiri` dengan variabel CSS `--font-bodoni`, `--font-jost`, `--font-amiri`

- [x] **Step 1: Tulis failing unit test `tests/fonts/fonts.test.ts`**

```typescript
import { describe, it, expect, vi } from 'vitest';

// Mocking next/font/google untuk lingkungan vitest
vi.mock('next/font/google', () => ({
  Bodoni_Moda: vi.fn().mockReturnValue({
    variable: '--font-bodoni',
    className: 'mock-bodoni',
  }),
  Jost: vi.fn().mockReturnValue({
    variable: '--font-jost',
    className: 'mock-jost',
  }),
  Amiri: vi.fn().mockReturnValue({
    variable: '--font-amiri',
    className: 'mock-amiri',
  }),
}));

describe('Google Fonts Configuration', () => {
  it('exports bodoniModa, jost, and amiri with proper CSS variables', async () => {
    const fonts = await import('@/app/fonts');

    expect(fonts.bodoniModa.variable).toBe('--font-bodoni');
    expect(fonts.jost.variable).toBe('--font-jost');
    expect(fonts.amiri.variable).toBe('--font-amiri');
  });
});
```

- [x] **Step 2: Jalankan test untuk memastikan kegagalan (Red)**

Run: `pnpm test tests/fonts/fonts.test.ts`  
Expected: FAIL karena `@/app/fonts` belum ada.

- [x] **Step 3: Implementasikan `src/app/fonts.ts`**

```typescript
import { Bodoni_Moda, Jost, Amiri } from 'next/font/google';

/**
 * Bodoni Moda: Display Serif untuk Headings & Monogram (Didone High-Fashion)
 */
export const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bodoni',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
});

/**
 * Jost: Geometris Modern untuk Body, UI, Data Tabular, dan Label
 */
export const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
  weight: ['300', '400', '500', '600'],
});

/**
 * Amiri: Kaligrafi Arab Al-Qur'an (Surat Ar-Rum 21 & Doa Sakral)
 */
export const amiri = Amiri({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-amiri',
  weight: ['400', '700'],
});
```

- [x] **Step 4: Jalankan test untuk memastikan kelulusan (Green)**

Run: `pnpm test tests/fonts/fonts.test.ts`  
Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add src/app/fonts.ts tests/fonts/fonts.test.ts
git commit -m "feat(typography): integrate Bodoni Moda, Jost, and Amiri Google Fonts"
```

---

### Task 6: Komponen Ornamen Vektor Budaya Jawa (Kawung & Truntum)

**Files:**
- Create: `src/components/ornaments/KawungBackground.tsx`
- Create: `src/components/ornaments/TruntumDivider.tsx`
- Test: `tests/components/ornaments.test.tsx`

**Interfaces:**
- Consumes: SSoT [`DESIGN.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/DESIGN.md) (Bagian 5.2 & 5.3), `src/lib/utils.ts`
- Produces:
  - `<KawungBackground />`: Pola SVG tile Kawung halus (opasitas 5%) dengan radial vignette mask
  - `<TruntumDivider />`: Garis pembatas elegan dengan bunga truntum Prada Emas di tengah

- [x] **Step 1: Tulis failing unit test `tests/components/ornaments.test.tsx`**

```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KawungBackground } from '@/components/ornaments/KawungBackground';
import { TruntumDivider } from '@/components/ornaments/TruntumDivider';

describe('Javanese Ornaments Components', () => {
  it('renders KawungBackground with proper pattern definition and aria-hidden', () => {
    const { container } = render(<KawungBackground className="custom-kawung" />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass('custom-kawung');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');

    const pattern = container.querySelector('#kawung-pattern');
    expect(pattern).toBeInTheDocument();
  });

  it('renders TruntumDivider with separator role and Prada floral icon', () => {
    render(<TruntumDivider className="my-8" />);
    const divider = screen.getByRole('separator');

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('my-8');

    const svgIcon = divider.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });
});
```

- [x] **Step 2: Jalankan test untuk memastikan kegagalan (Red)**

Run: `pnpm test tests/components/ornaments.test.tsx`  
Expected: FAIL karena komponen belum dibuat.

- [x] **Step 3: Implementasikan `KawungBackground.tsx` dan `TruntumDivider.tsx`**

Tulis `src/components/ornaments/KawungBackground.tsx`:

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface KawungBackgroundProps {
  className?: string;
}

/**
 * Pola Latar Geometris Batik Kawung Solo
 * Opasitas 5% Sogan Tua dengan radial gradient mask sesuai SSoT DESIGN.md 5.2
 */
export function KawungBackground({ className }: KawungBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden select-none',
        className
      )}
      style={{
        maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 78%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 78%)',
      }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="kawung-pattern"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <g fill="none" stroke="#6B4423" strokeWidth="1" opacity="0.05">
              <ellipse cx="32" cy="16" rx="13" ry="15" />
              <ellipse cx="32" cy="48" rx="13" ry="15" />
              <ellipse cx="16" cy="32" rx="15" ry="13" />
              <ellipse cx="48" cy="32" rx="15" ry="13" />
              <circle cx="32" cy="32" r="2.5" fill="#6B4423" stroke="none" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kawung-pattern)" />
      </svg>
    </div>
  );
}
```

Tulis `src/components/ornaments/TruntumDivider.tsx`:

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface TruntumDividerProps {
  className?: string;
}

/**
 * Divider Ornamen Bunga Truntum
 * Garis simetris 1px dengan ikon bunga truntum Prada Emas (#C2A05B) di tengah sesuai SSoT DESIGN.md 5.3
 */
export function TruntumDivider({ className }: TruntumDividerProps) {
  return (
    <div
      role="separator"
      className={cn(
        'flex items-center justify-center gap-3 w-full py-2',
        className
      )}
    >
      {/* Garis Kiri */}
      <span className="h-px w-[72px] bg-surakarta-line-strong" />

      {/* Ikon Bunga Truntum Prada Emas */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-surakarta-gold shrink-0"
        aria-hidden="true"
      >
        <path
          d="M10 2L11.5 7.5L17 6L13 10.5L17 15L11.5 13.5L10 19L8.5 13.5L3 15L7 10.5L3 6L8.5 7.5L10 2Z"
          fill="currentColor"
        />
        <circle cx="10" cy="10.5" r="1.5" fill="#6B4423" />
      </svg>

      {/* Garis Kanan */}
      <span className="h-px w-[72px] bg-surakarta-line-strong" />
    </div>
  );
}
```

- [x] **Step 4: Jalankan test untuk memastikan kelulusan (Green)**

Run: `pnpm test tests/components/ornaments.test.tsx`  
Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add src/components/ornaments/KawungBackground.tsx src/components/ornaments/TruntumDivider.tsx tests/components/ornaments.test.tsx
git commit -m "feat(ornaments): implement Kawung background pattern and Truntum divider"
```

---

### Task 7: Root Layout, Smoke Page & Verifikasi Gerbang Kualitas

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Test: `tests/app/page.test.tsx`

**Interfaces:**
- Consumes: `src/app/fonts.ts`, `src/app/globals.css`, `src/components/ornaments/KawungBackground.tsx`, `src/components/ornaments/TruntumDivider.tsx`
- Produces: Struktur dasar aplikasi Next.js 15 siap pakai dengan font injection dan verifikasi build/typecheck

- [x] **Step 1: Tulis failing unit test `tests/app/page.test.tsx`**

```tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('Root Page Smoke Test', () => {
  it('renders editorial welcome heading and Surakarta ornaments', () => {
    render(<HomePage />);

    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent(/Bespoke Luxury/i);

    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
  });
});
```

- [x] **Step 2: Jalankan test untuk memastikan kegagalan (Red)**

Run: `pnpm test tests/app/page.test.tsx`  
Expected: FAIL karena `src/app/layout.tsx` dan `src/app/page.tsx` belum ada.

- [x] **Step 3: Implementasikan `src/app/layout.tsx` dan `src/app/page.tsx`**

Tulis `src/app/layout.tsx`:

```tsx
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
```

Tulis `src/app/page.tsx`:

```tsx
import React from 'react';
import { KawungBackground } from '@/components/ornaments/KawungBackground';
import { TruntumDivider } from '@/components/ornaments/TruntumDivider';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Background motif Kawung */}
      <KawungBackground />

      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        <span className="text-xs uppercase tracking-widest text-surakarta-brand font-body font-medium">
          Surakarta Royal Heritage
        </span>

        <h1 className="text-4xl md:text-5xl font-display text-surakarta-fg leading-tight">
          Bespoke Luxury Digital Wedding Invitation
        </h1>

        <TruntumDivider className="my-4" />

        <p className="text-surakarta-fg-body font-body text-base max-w-md mx-auto leading-relaxed">
          Fondasi sistem desain, perancah kode Next.js 15, dan aset budaya Surakarta siap digunakan untuk fase berikutnya.
        </p>
      </div>
    </main>
  );
}
```

- [x] **Step 4: Jalankan seluruh pengujian dan verifikasi statis**

Run:
1. `pnpm test`  
   Expected: Semua suite tes unit (smoke, utils, design-tokens, fonts, ornaments, page) lulus 100%.
2. `pnpm typecheck`  
   Expected: `tsc --noEmit` exit 0 tanpa error.

- [x] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx tests/app/page.test.tsx
git commit -m "feat(app): construct RootLayout and baseline editorial smoke page"
```

---

## Self-Review Checklist
1. **Spec Coverage:**
   - 0.1 Inisialisasi Next.js 15, TS strict -> Task 1
   - 0.2 Instalasi Dependensi Terverifikasi -> Task 1 & Task 2
   - 0.3 Google Fonts Bodoni, Jost, Amiri -> Task 5
   - 0.4 Tailwind & CSS Variables Surakarta -> Task 3 & Task 4
   - 0.5 Ornamen Vektor Kawung & Truntum -> Task 6
   - Integrasi Root Layout & Smoke Page -> Task 7
2. **No Placeholders:** Semua instruksi mencantumkan kode utuh, path file presisi, perintah terminal eksak, dan ekspektasi hasil.
3. **Type Consistency:** Konfigurasi path alias `@/*` konsisten antara `tsconfig.json`, `vitest.config.ts`, dan seluruh berkas impor.
