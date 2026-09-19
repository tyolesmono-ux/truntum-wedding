# Implementation Plan: Gerbang Pembuka (3D Virtual Envelope) & Audio Engine

**Branch**: `002-virtual-envelope-audio` | **Date**: 2026-09-19 | **Spec**: [`specs/002-virtual-envelope-audio/spec.md`](./spec.md)

**Input**: Feature specification from `specs/002-virtual-envelope-audio/spec.md` and technical research in `specs/002-virtual-envelope-audio/research.md`.

---

## Summary

Mengimplementasikan subsistem gerbang pembuka undangan digital mewah (Fase 2) yang menyajikan amplop virtual 3D realistis berlatar Malam Wulung (`#15120F`) dengan segel lilin monogram inisial mempelai Cinde (`#8C2F27`) dan Prada Emas (`#C2A05B`), personalisasi nama tamu dinamis via parameter URL (`?to=`), orkestrasi pembukaan 4 langkah terkoordinasi (retak segel, flap terbuka 180°, surat meluncur, dan unmount via `AnimatePresence`), serta Web Audio API engine yang patuh pada kebijakan autoplay browser modern dengan kurva kenaikan volume linier $0.0 \rightarrow 0.8$ dalam 2.5 detik, auto-pause tab latar belakang, dan tombol pengontrol mengambang piringan vinyl (`FloatingVinyl`) di sudut kanan bawah.

---

## Technical Context

**Language/Version**: TypeScript 5.6.3 (Strict mode: `strict: true`, `noImplicitAny: true`)  
**Primary Dependencies**: Next.js 15.1.0 App Router, React 19.0.0, `motion/react` (^11.11.7), `lucide-react`, `clsx`, `tailwind-merge`  
**Storage**: N/A (Data konfigurasi audio imutabel di `src/lib/config/wedding-data.ts`, tanpa mutasi database)  
**Testing**: Vitest 2.1.1, `@testing-library/react` 16.0.1, `@testing-library/jest-dom` 6.5.0, JSDOM 25.0.1  
**Target Platform**: Mobile Web Browser (iPhone Safari 390×844px, Android Chrome), responsif desktop center max 720px  
**Project Type**: Next.js Web Application  
**Performance Goals**: 60 FPS animasi GPU-composited, bundle JS awal $\le 90\text{ KB}$ gzipped, linear volume ramp $2.5\text{s} \pm 0.1\text{s}$  
**Constraints**: Zero autoplay on load, WCAG AA contrast ratio & tap target $\ge 44\times 44\text{ px}$, micro-fade 150ms on play/pause  
**Scale/Scope**: 5 komponen UI/audio utama, 1 context provider, 1 modul konfigurasi audio, 4 berkas unit test Vitest  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. SSoT Design & Editorial Aesthetics**: Menggunakan token resmi Surakarta (`#15120F`, `#E8DCC8`, `#FCFAF5`, `#8C2F27`, `#C2A05B`), tipografi resmi (*Bodoni Moda* untuk heading nama tamu, *Jost* untuk body & tombol), *sentence case* tanpa pengecualian (*"Buka undangan"*, *"Jeda musik"*, *"Kepada Bapak/Ibu/Saudara"*), radius 2px tombol, radius 4px kartu, piringan 50%.
- [x] **II. Zero-Trust Financial Security**: Tidak ada mutasi atau kueri data rekening/QRIS; konfigurasi audio bersifat deklaratif *read-only* di `wedding-data.ts`.
- [x] **III. Input Sanitization**: Parameter nama tamu `?to=` dibaca asinkron di Server Component dan disanitasi dari tag HTML/skrip sebelum di-pass ke komponen UI.
- [x] **IV. Mobile-First 60 FPS & Autoplay Compliance**:
  - Audio TIDAK PERNAH autoplay saat mount awal.
  - Audio Context dibuka murni melalui gestur klik fisik segel lilin / tombol CTA.
  - Volume fade-in linier 2.5 detik via `linearRampToValueAtTime`.
  - Auto-pause saat tab tersembunyi (`document.visibilityState === 'hidden'`).
  - Animasi murni GPU-accelerated (`transform: rotateX/translateY/scale`, `opacity`).
  - Fallback 200ms cross-fade jika `prefers-reduced-motion: reduce`.
  - Bundle awal tetap ramping di bawah 90 KB gzipped.
- [x] **V. Server Components by Default & Strict TypeScript**: `page.tsx` adalah Server Component; hanya leaf components interaktif (`VirtualEnvelope`, `WaxSeal`, `FloatingVinyl`, `AudioProvider`) yang berlabel `'use client'`.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-virtual-envelope-audio/
├── plan.md              # Rencana implementasi teknis
├── research.md          # Riset arsitektur teknis (Phase 0)
├── data-model.md        # State machine dan data model (Phase 1)
├── quickstart.md        # Panduan verifikasi run-through (Phase 1)
├── contracts/           # Kontrak antarmuka TypeScript (Phase 1)
│   ├── audio-engine.contract.ts
│   └── virtual-envelope.contract.ts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code Layout

```text
src/
├── app/
│   ├── layout.tsx                       # Root layout dengan font dan metadata
│   └── page.tsx                         # Server Component pembaca searchParams (?to=...)
├── contexts/
│   └── AudioContext.tsx                 # [NEW] AudioProvider & useAudio hook (Web Audio API Engine)
├── components/
│   ├── opening/
│   │   ├── VirtualEnvelope.tsx          # [NEW] Container 3D fullscreen overlay & orchestrator
│   │   ├── WaxSeal.tsx                  # [NEW] Segel lilin monogram 72px dengan animasi retak mikro
│   │   └── InvitationLetter.tsx         # [NEW] Kartu surat meluncur keluar dari kantong amplop
│   └── audio/
│       └── FloatingVinyl.tsx            # [NEW] Pemutar piringan vinyl mengambang 52px sudut kanan bawah
└── lib/
    └── config/
        └── wedding-data.ts              # [MODIFY] Tambahkan konstanta WEDDING_AUDIO_CONFIG

public/
└── audio/
    └── wedding-ambient.mp3              # [NEW] Aset audio lokal instrumental ambient pernikahan

tests/
├── mocks/
│   └── audio-mock.ts                    # [NEW] Mock Web Audio API & visibilityState untuk Vitest
├── unit/
│   ├── audio-context.test.tsx           # [NEW] Unit test AudioProvider & Web Audio API state machine
│   └── wedding-data.test.ts             # [MODIFY] Validasi WEDDING_AUDIO_CONFIG imutabel
└── components/
    ├── virtual-envelope.test.tsx        # [NEW] Unit test VirtualEnvelope, personalisasi, unmount
    ├── wax-seal.test.tsx                # [NEW] Unit test WaxSeal micro-crack & aksesibilitas
    └── floating-vinyl.test.tsx          # [NEW] Unit test FloatingVinyl rotasi & reduced-motion
```

---

## Complexity Tracking

*Constitution Check passed with ZERO violations. No unnecessary complexity or extra dependencies introduced.*
