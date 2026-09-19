# Coding Standards & Engineering Guidelines (CODING_STANDARD.md)
## Bespoke Luxury Digital Wedding Invitation

- **Version**: 1.0.0
- **Status**: Active / Enforced
- **Author**: Antigravity Technical Architecture Team
- **Related Specs**:
  - PRD: [`PRD.md`](./PRD.md)
  - Design System: [`DESIGN.md`](./DESIGN.md)
  - Tech Stack: [`TECH_STACK.md`](./TECH_STACK.md)
  - Architecture: [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 1. Core Engineering Principles

Setiap baris kode dalam proyek ini harus mencerminkan standar estetika editorial tinggi dan keandalan sistem produksi:

1. **Editorial Elegance with High Performance**: Animasi dan interaktivitas mewah tidak boleh mengorbankan performa seluler. Target mutlak adalah 60 FPS pada perangkat seluler standar (iOS Safari & Android Chrome).
2. **Zero-Trust Input & Defense-in-Depth**: Semua input eksternal (nama tamu, pesan doa restu) dianggap berbahaya sampai tervalidasi dan tersanitasi secara menyeluruh.
3. **Strict Type Safety**: Menggunakan TypeScript dalam mode ketat (*strict mode*). Penggunaan tipe `any` atau *type assertions* longgar (`as any`) dilarang keras.
4. **Server Components by Default**: Komponen Next.js secara default adalah React Server Component (RSC). Batasi penggunaan `'use client'` hanya pada komponen yang benar-benar memerlukan reaktivitas state, efek browser, atau event listener.
5. **No Layout Thrashing**: Hindari manipulasi DOM langsung atau animasi properti geometrik (`top`, `left`, `margin`, `width`, `height`). Gunakan `transform: translate3d()` dan `opacity` yang diakselerasi GPU.

---

## 2. Directory & File Organization Standards

### 2.1 File Naming Conventions
- **React Components**: PascalCase (contoh: `WaxSeal.tsx`, `FloatingVinyl.tsx`, `HeroSection.tsx`).
- **Hooks**: camelCase dengan awalan `use` (contoh: `useGuestbookRealtime.ts`, `useAudioController.ts`).
- **Server Actions & Utilities**: kebab-case (contoh: `submit-rsvp.ts`, `sanitize.ts`, `rate-limiter.ts`).
- **Type Definitions**: kebab-case atau `index.ts` (contoh: `rsvp-types.ts`, `supabase.ts`).
- **Config & Constants**: kebab-case (contoh: `wedding-data.ts`).

### 2.2 Component Structure Template
Setiap komponen React harus mengikuti susunan terstruktur:

```tsx
// 1. Client Directive (jika diperlukan)
'use client';

// 2. Standard library & framework imports
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// 3. Third-party library imports
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

// 4. Internal project imports (Absolute paths @/...)
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { AudioControllerProps } from '@/types';

// 5. Interface/Type definitions
interface FloatingVinylProps {
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
}

// 6. Main Component declaration
export function FloatingVinyl({ isPlaying, onToggle, className }: FloatingVinylProps) {
  // 6.1 State & Hooks
  // 6.2 Handlers & Callbacks
  // 6.3 Render JSX
  return (
    <div className={cn('relative flex items-center', className)}>
      {/* JSX Content */}
    </div>
  );
}
```

---

## 3. TypeScript Standards & Strict Typing

### 3.1 Strict Configuration
File `tsconfig.json` wajib mengaktifkan flag ketat:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 3.2 Rules of Typing
1. **Dilarang Menggunakan `any`**:
   - Gunakan tipe konkret atau `unknown` jika tipe data belum dipastikan saat runtime.
   - Lakukan *type narrowing* menggunakan guard fungsi atau skema Zod.
   ```typescript
   // ❌ DILARANG
   function parseData(input: any) {
     return input.guest_name;
   }

   // ✅ BENAR
   function parseData(input: unknown): string {
     const result = rsvpSchema.safeParse(input);
     if (!result.success) throw new Error('Data tidak valid');
     return result.data.guest_name;
   }
   ```
2. **Explicit Return Types pada Server Actions & Utilities**:
   Fungsi yang diekspor untuk konsumsi publik atau Server Action wajib mendeklarasikan tipe nilai kembalian secara eksplisit.
   ```typescript
   // ✅ BENAR
   export async function submitRSVP(
     payload: RSVPInput
   ): Promise<ActionResponse<RSVPRecord>> {
     // ...
   }
   ```
3. **Prefer Interface untuk Struktur Objek & Type untuk Union/Utility**:
   ```typescript
   // ✅ Interface untuk bentuk entitas
   export interface WeddingCouple {
     name: string;
     title: string;
     instagramHandle: string;
     bio: string;
   }

   // ✅ Type untuk Union atau Variasi
   export type AttendanceStatus = 'attending' | 'declined';
   ```

---

## 4. Next.js 15 & React 19 Best Practices

### 4.1 Server Components vs. Client Components Boundary
- Letakkan pengambilan data awal (*initial fetch*) pada **Server Component** (`src/app/page.tsx`).
- Di **Next.js 15**, `params` dan `searchParams` adalah `Promise` asinkron dan **wajib di-`await`**:
  ```tsx
  // src/app/page.tsx (Server Component)
  import { getInitialWishes } from '@/lib/supabase/queries';
  import { OpeningGate } from '@/components/opening/OpeningGate';
  import { RSVPAndWishes } from '@/components/sections/RSVPAndWishes';

  interface PageProps {
    searchParams: Promise<{ to?: string }>;
  }

  export default async function WeddingPage({ searchParams }: PageProps) {
    // Next.js 15: searchParams adalah Promise
    const resolvedSearchParams = await searchParams;
    const guestName = resolvedSearchParams.to?.trim() || 'Tamu Undangan';
    const initialWishes = await getInitialWishes();

    return (
      <main>
        <OpeningGate guestName={guestName} />
        {/* Static / SSR sections */}
        <RSVPAndWishes initialWishes={initialWishes} />
      </main>
    );
  }
  ```

### 4.2 Next.js 15 Asynchronous Request APIs (`cookies()` & `headers()`)
- Seluruh fungsi pembacaan konteks permintaan HTTP di Next.js 15 bersifat asinkron:
  ```typescript
  import { cookies, headers } from 'next/headers';

  // ✅ BENAR: Await cookies dan headers
  export async function getClientContext() {
    const cookieStore = await cookies();
    const headerList = await headers();
    const ip = headerList.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    return { cookieStore, ip };
  }
  ```

### 4.3 Server Actions Conventions
1. **Selalu letakkan `'use server'` di baris paling atas berkas action**.
2. **Bungkus seluruh alur Server Action dengan `try-catch`** dan kembalikan struktur amplop seragam (*Envelope Pattern*):
   ```typescript
   export type ActionResponse<T = unknown> = 
     | { success: true; data: T }
     | { success: false; error: string; message: string; details?: Record<string, string[]> };
   ```
3. **Jangan pernah membocorkan pesan error teknis mentah atau stack trace database ke pengguna**.

### 4.4 Cleanup Memory & Event Listeners
Setiap listener WebSocket, audio event, atau window scroll wajib dibersihkan di blok return `useEffect`:
```typescript
useEffect(() => {
  const handleResize = () => { /* ... */ };
  window.addEventListener('resize', handleResize, { passive: true });
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

---

## 5. Tailwind CSS & Styling Guidelines

### 5.1 Utility Function `cn()`
Gunakan utilitas `cn` (`clsx` + `tailwind-merge`) untuk penggabungan kelas kondisional:
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 5.2 Konsistensi Desain Token Editorial
- Gunakan variabel CSS token yang terdefinisi pada [`TECH_STACK.md`](./TECH_STACK.md) dan [`DESIGN.md`](./DESIGN.md) (misal: `bg-[var(--bg)]`, `text-[var(--fg)]`, `border-[var(--line-strong)]`).
- Hindari menyisipkan sembarang warna heksadesimal acak yang menyimpang dari palet majalah editorial.

### 5.3 Aturan Responsif Seluler (Mobile-First)
- Utilitas tanpa prefix berlaku untuk smartphone (`min-width: 0px`).
- Terapkan prefix `md:` (tablet) dan `lg:` (desktop) hanya untuk penyempurnaan tampilan layar lebar:
  ```tsx
  // ✅ BENAR: Mobile-first
  <div className="px-4 py-8 md:px-12 md:py-16 lg:px-24">
  ```

---

## 6. Motion & Animation Standards (`motion/react`)

### 6.1 Akselerasi Perangkat Keras (GPU Acceleration)
Hanya animasikan properti berikut dalam animasi transisi utama:
- `transform` (`x`, `y`, `scale`, `rotateX`, `rotateY`, `rotateZ`)
- `opacity`

Hindari menganimasikan properti geometrik yang memicu *browser reflow* (`top`, `left`, `margin`, `width`).
*Catatan Pengecualian*: Sesuai [`DESIGN.md`](./DESIGN.md) Bagian 6.6, animasi penyisipan ucapan baru pada buku tamu diperbolehkan menggunakan transisi tinggi (`height: 0 → auto`, 240ms) untuk menjelaskan perubahan status (*state explanation*).

### 6.2 Batasan Animasi & Aksesibilitas (`prefers-reduced-motion`)
1. **Aturan Single Source of Truth ([`DESIGN.md`](./DESIGN.md))**:
   - DILARANG memberikan animasi *fade-up* di setiap section atau efek *hover* di setiap kartu.
   - Efek *reveal* hanya diizinkan pada bagian **Ayat Suci & Doa** serta **Love Story**. Bagian lain tampil tenang tanpa animasi scroll.
2. **Dukungan Reduced Motion**:
   Hormati preferensi pengguna dengan hook `useReducedMotion`:
   ```tsx
   import { useReducedMotion, motion } from 'motion/react';

   export function QuranReveal({ children }: { children: React.ReactNode }) {
     const shouldReduceMotion = useReducedMotion();

     return (
       <motion.div
         initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: '-10% 0px' }}
         transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
       >
         {children}
       </motion.div>
     );
   }
   ```

---

## 7. Audio Engine & Autoplay Standards

1. **Gesture Unlock**: Inisialisasi audio tidak boleh dipanggil saat *page load* awal. Wajib diikat pada aksi klik segel lilin (*wax seal*).
2. **Fade-In Ramp**: Dilarang langsung memutar audio pada volume 100%. Gunakan `linearRampToValueAtTime` dari volume 0 ke 0.8 dalam rentang 2.5 detik untuk menciptakan suasana santun dan mewah.
3. **Visibility Optimization**:
   Hentikan pemutaran secara otomatis saat tab diminimalkan untuk menjaga daya baterai perangkat tamu:
   ```typescript
   useEffect(() => {
     const onVisibilityChange = () => {
       if (document.hidden && isPlaying) {
         audioRef.current?.pause();
       } else if (!document.hidden && isPlaying) {
         audioRef.current?.play();
       }
     };
     document.addEventListener('visibilitychange', onVisibilityChange);
     return () => document.removeEventListener('visibilitychange', onVisibilityChange);
   }, [isPlaying]);
   ```

---

## 8. Git Commit & Quality Control Checklist

### 8.1 Format Pesan Commit (Conventional Commits)
Gunakan format standar: `<type>(<scope>): <short description>`
- `feat(opening)`: implement 3D envelope fold and wax seal crack animation
- `feat(audio)`: add Web Audio API linear fade-in controller
- `fix(security)`: add URL pattern rejection in guestbook sanitization
- `perf(gallery)`: optimize masonry images with Next.js Image and AVIF format
- `docs(api)`: update submitRSVP response payload documentation

### 8.2 Checklist Sebelum Merge / Selesai Tugas
- [ ] Jalankan `pnpm typecheck` (`tsc --noEmit`) tanpa satupun error tipe.
- [ ] Jalankan `pnpm lint` dan pastikan tidak ada peringatan kode mati atau variabel tak terpakai.
- [ ] Pastikan tidak ada `console.log` debug yang tertinggal di berkas produksi.
- [ ] Pastikan tidak ada kredensial atau rahasia server (misal: `SUPABASE_SERVICE_ROLE_KEY`) yang bocor ke Client Components atau git tracking.
- [ ] Pastikan tidak ada penggunaan `dangerouslySetInnerHTML`.
