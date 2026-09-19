# Implementation Plan: Seksi Halaman Utama & Narasi Editorial (Fase 3A)

**Branch**: `003-editorial-sections` | **Date**: 2026-09-19 | **Spec**: [`specs/003-editorial-sections/spec.md`](./spec.md)  

**Input**: Feature specification from [`specs/003-editorial-sections/spec.md`](./spec.md)  

---

## Summary

Mengimplementasikan fondasi halaman utama dan 5 seksi editorial inti pernikahan (*Bespoke Luxury Digital Wedding Invitation*) mengacu pada SSoT [`docs/DOKUMEN_TEKNIS/DESIGN.md`](../../docs/DOKUMEN_TEKNIS/DESIGN.md):
1. Orkestrasi scroll inersia menggunakan Lenis (`lerp: 0.085`, `syncTouch: false` untuk native 60–120 FPS mobile touch) yang terintegrasi dengan gerbang amplop virtual.
2. Seksi sampul Hero sinematik berlayar penuh dengan tipografi *Bodoni Moda Didone* berukuran besar.
3. Seksi Ayat Suci Al-Qur'an (Surat Ar-Rum: 21) berkaligrafi Arab font *Amiri* subset, terjemahan puitis, dan doa sunnah pernikahan.
4. Seksi Profil Mempelai responsif dengan foto potret berbingkai kubah keraton (*arch/ogee*), silsilah keluarga, dan tautan sosial santun.
5. Seksi Hitung Mundur Hari H reaktif berbasis angka tabular berbingkai Gunungan Prada Emas dengan pelindung hidrasi SSR.
6. Seksi Rangkaian Acara (Akad Nikah & Resepsi) berformat *left-aligned* dengan integrasi Google Calendar, generator berkas `.ics`, serta tombol navigasi langsung ke Google Maps dan Waze.

---

## Technical Context

**Language/Version**: TypeScript 5.6+ (Mode ketat: `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`)  
**Primary Dependencies**: Next.js 15.1 (App Router), React 19, `lenis` (`lenis/react`), `motion` (`motion/react`), `lucide-react`, `clsx`, `tailwind-merge`  
**Storage**: Static immutable configuration file ([`src/lib/config/wedding-content.ts`](../../src/lib/config/wedding-content.ts)) dengan `deepFreeze()` dan `as const`  
**Testing**: Vitest 2.1 + React Testing Library 16 (`@testing-library/react`, `@testing-library/jest-dom`)  
**Target Platform**: Mobile-first Web (fokus utama layar 390×844 iPhone 12/13/14 dan Android Chrome, responsif terpusat hingga 720px di desktop)  
**Project Type**: Next.js Web Application  
**Performance Goals**: Stabil 60 FPS pada perangkat seluler, CLS = 0, initial bundle gzipped $\le 90\text{ KB}$, font payload $\le 120\text{ KB}$  
**Constraints**: Kepatuhan mutlak terhadap palet warna Surakarta SSoT, 3 famili font (Bodoni Moda, Jost, Amiri), penulisan *sentence case*, zero-trust data finansial, zero XSS  
**Scale/Scope**: 1 berkas konfigurasi konten statis, 1 wrapper layout scroll, 5 komponen seksi editorial, 1 custom hook timer, serta berkas tes unit pendamping  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Prinsip Konstitusi | Status Evaluasi | Justifikasi Teknis |
| :--- | :---: | :--- |
| **I. SSoT Design & Palet Surakarta** | ✅ PASS | Seluruh komponen menggunakan token warna resmi (`#F6F1E7`, `#FCFAF5`, `#E8DCC8`, `#15120F`, `#231F1B`, `#6B4423`, `#C2A05B`), 3 font, dan *sentence case*. |
| **II. Zero-Trust Financial Data** | ✅ PASS | Data kado/finansial tetap terisolasi di `wedding-data.ts`. Konfigurasi editorial di `wedding-content.ts` bersifat statis, *read-only*, dan tidak memiliki API mutasi publik. |
| **III. Input Sanitization & Anti-XSS** | ✅ PASS | Tidak ada input teks bebas pada seksi 3.1–3.6. Seluruh rendering teks menggunakan React safe interpolation, tanpa `dangerouslySetInnerHTML`. |
| **IV. Mobile-First 60 FPS & Autoplay** | ✅ PASS | Lenis dikonfigurasi dengan `syncTouch: false` untuk native momentum scroll di ponsel. Tidak ada autoplay musik saat load; audio tetap di-unlock via gestur wax seal amplop. |
| **V. Server Components & TypeScript** | ✅ PASS | Halaman utama (`page.tsx`) adalah Server Component. Komponen client (`'use client'`) dibatasi hanya pada daun komponen interaktif (Lenis wrapper, countdown hook, popover kalender). Tipe data ketat 100%. |

---

## Project Structure

### Documentation (this feature)

```text
specs/003-editorial-sections/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 research decisions
├── data-model.md        # Phase 1 data schema & entities
├── quickstart.md        # Phase 1 verification & test guide
├── checklists/
│   └── requirements.md  # Spec quality validation checklist
└── contracts/
    ├── calendar-integration.md # RFC 5545 & Google Calendar link specification
    └── component-interfaces.md # TypeScript interfaces for all components
```

### Source Code (repository root)

```text
src/
├── app/
│   └── page.tsx                               # [MODIFY] Integrasi SmoothScrollProvider dan seksi-seksi editorial
├── components/
│   ├── layout/
│   │   ├── SmoothScrollProvider.tsx           # [NEW] Wrapper ReactLenis dengan scroll-locking
│   │   └── SmoothScrollProvider.test.tsx      # [NEW] Unit test wrapper Lenis
│   └── sections/
│       ├── HeroSection.tsx                    # [NEW] Sampul editorial sinematik full-bleed
│       ├── HeroSection.test.tsx               # [NEW] Unit test HeroSection
│       ├── IslamicQuotes.tsx                  # [NEW] Ar-Rum 21 teks Arab Amiri & terjemahan
│       ├── IslamicQuotes.test.tsx             # [NEW] Unit test IslamicQuotes
│       ├── CoupleProfile.tsx                  # [NEW] Profil mempelai kubah ogee & nasab
│       ├── CoupleProfile.test.tsx             # [NEW] Unit test CoupleProfile
│       ├── CountdownSection.tsx               # [NEW] Timer hitung mundur bingkai Gunungan
│       ├── CountdownSection.test.tsx          # [NEW] Unit test CountdownSection
│       ├── EventDetails.tsx                   # [NEW] Akad & Resepsi + Kalender / Peta
│       └── EventDetails.test.tsx              # [NEW] Unit test EventDetails
├── hooks/
│   ├── useCountdown.ts                        # [NEW] Custom hook reaktif waktu mundur SSR-safe
│   └── useCountdown.test.ts                   # [NEW] Unit test kalkulasi timer
└── lib/
    ├── config/
    │   └── wedding-content.ts                 # [NEW] Objek data editorial statis (as const)
    └── utils/
        ├── calendar.ts                        # [NEW] Helper generator Google Calendar URL & berkas .ics
        └── calendar.test.ts                   # [NEW] Unit test helper kalender
```

**Structure Decision**: Mengikuti arsitektur Next.js 15 modular berbasis komponen presentasional (`src/components/sections/`), utilitas kalender terisolasi (`src/lib/utils/calendar.ts`), serta hooks reaktif (`src/hooks/useCountdown.ts`).

---

## Complexity Tracking

> **Semua gerbang Konstitusi lulus (Zero Violations). Tidak ada abstraksi berlebih atau pelanggaran standar.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| *None* | N/A | N/A |
