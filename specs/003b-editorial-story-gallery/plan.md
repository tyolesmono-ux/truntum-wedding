# Implementation Plan: Seksi Linimasa Kisah Cinta & Galeri Sinematik (Fase 3B)

**Branch**: `003b-editorial-story-gallery` | **Date**: 2026-09-19 | **Spec**: [`specs/003b-editorial-story-gallery/spec.md`](./spec.md)

**Input**: Feature specification from `specs/003b-editorial-story-gallery/spec.md`

---

## Summary

Mengimplementasikan dua seksi editorial naratif utama berlatar Malam Wulung (`#15120F`) untuk undangan pernikahan digital mewah:
1. **Seksi 3.7: Linimasa Kisah Cinta (`LoveStoryTimeline.tsx`)**: Garis waktu vertikal emas di sisi kiri (*left-rail*) yang terikat pengguliran layar (*scroll-linked progress line* via Motion v11 `useScroll` & `useTransform`), titik penanda (*nodes*) Prada Emas berkilau halus, tipografi Didone tahun *Bodoni Moda*, dan teks narasi santun berfont *Jost*.
2. **Seksi 3.8: Galeri Foto Sinematik & Lightbox Gesture (`GalleryMasonry.tsx` & `LightboxModal.tsx`)**: Kurasi grid asimetris majalah editorial seni (perpaduan foto lanskap 16:9 *full-width* dan potret 3:4 dua kolom *full-bleed*) dengan modal Lightbox interaktif yang mendukung gestur usapan ponsel (*horizontal swipe* prev/next, *swipe-down to dismiss*, *double-tap zoom*), kontrol keyboard (`Escape`, panah kiri/kanan), bilah atas indikator foto, bilah bawah teks *caption* editorial, serta penguncian mutlak pengguliran Lenis saat modal terbuka.

Kedua seksi menggunakan model data imutabel `LoveStoryMilestone` dan `GalleryPhoto` yang diintegrasikan ke dalam `src/lib/config/wedding-content.ts` serta disambungkan secara harmonis ke dalam `src/app/page.tsx`.

---

## Technical Context

**Language/Version**: TypeScript 5.6.3 / Node.js 20+ (mode ketat: `strict: true`, `noImplicitAny: true`)  
**Primary Dependencies**: Next.js 15.1.0 (App Router), React 19.0.0, Motion (`motion/react` v11.11.7), Lenis 1.1.14 (`lenis/react`), Lucide React 0.446.0, Tailwind CSS 3.4.13  
**Storage**: In-memory static constants di `src/lib/config/wedding-content.ts` (`as const` + `deepFreeze`)  
**Testing**: Vitest 2.1.1, React Testing Library 16.0.1, `@testing-library/jest-dom` 6.5.0  
**Target Platform**: Perangkat seluler (iOS Safari, Android Chrome pada viewport 390×844) & Desktop evergreen browsers  
**Project Type**: Next.js Web Application (Luxury Digital Wedding Invitation)  
**Performance Goals**: Stabil 60 FPS pada scroll ponsel, CLS = 0, latensi respons interaksi modal & gestur sentuh < 100ms, ukuran berkas foto $\le 150\text{ KB}$ (AVIF/WebP)  
**Constraints**: Kepatuhan mutlak SSoT `DESIGN.md` (palet Surakarta Malam Wulung `#15120F`, Prada Emas `#C2A05B`, 3 font resmi, *sentence case*, radius 2px/4px, tanpa template AI slop), prinsip `/ponytail full` (solusi paling ringkas dan kokoh), isolasi penuh tanpa ketergantungan API eksternal yang tidak perlu  
**Scale/Scope**: 3 babak linimasa kisah cinta, 7 foto galeri kurasi asimetris, 2 komponen seksi baru, 1 komponen modal Lightbox, dan integrasi ke `page.tsx`  

---

## Constitution Check

*GATE: Evaluasi gerbang kepatuhan terhadap Konstitusi Proyek (`.specify/memory/constitution.md`):*

| Prinsip Konstitusi | Status | Analisis Kepatuhan Arsitektur |
| :--- | :---: | :--- |
| **I. SSoT Design & Aesthetics** | **PASS** | Palet Malam Wulung `#15120F`, teks `--fg-on-dark` `#EFE6D6` & `--fg-muted-dark` `#A89680`, aksen Prada Emas `#C2A05B`. Tipografi *Bodoni Moda* (tahun) & *Jost* (narasi/UI). Layout *left-rail* & asimetris *full-bleed*. Animasi reveal hanya pada Love Story. |
| **II. Zero-Trust Financial Security** | **PASS** | Fitur ini tidak menangani atau memodifikasi data finansial. Seluruh konten bersifat naratif statis terisolasi di `wedding-content.ts`. |
| **III. Input Sanitization & Anti-Abuse** | **PASS** | Seluruh data narasi bersifat baca-saja (*immutable*), bebas dari input eksternal publik atau celah XSS. |
| **IV. Mobile-First 60 FPS & Autoplay** | **PASS** | Hanya menganimasikan GPU-composited properties (`scaleY`, `transform`, `opacity`). Menghentikan Lenis scroll saat modal terbuka. Tidak memicu audio play di luar gestur segel lilin. |
| **V. Server Components & TypeScript** | **PASS** | Server Component di `page.tsx`, `'use client'` terbatas pada leaf component interaktif (`LoveStoryTimeline`, `GalleryMasonry`, `LightboxModal`). Tipe data ketat tanpa `any`. |

---

## Project Structure

### Documentation (this feature)

```text
specs/003b-editorial-story-gallery/
├── plan.md              # Rencana implementasi teknis (berkas ini)
├── research.md          # Keputusan arsitektur & investigasi teknis
├── data-model.md        # Definisi entitas LoveStoryMilestone & GalleryPhoto
├── quickstart.md        # Panduan verifikasi pengujian otomatis & manual
└── contracts/
    └── ui-contracts.md  # Kontrak antarmuka & properti komponen UI
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── config/
│       └── wedding-content.ts          # [MODIFY] Menambahkan LoveStoryMilestone & GalleryPhoto
├── components/
│   └── sections/
│       ├── LoveStoryTimeline.tsx       # [NEW] Komponen Seksi 3.7: Linimasa Kisah Cinta
│       ├── LoveStoryTimeline.test.tsx  # [NEW] Unit test TDD untuk LoveStoryTimeline
│       ├── GalleryMasonry.tsx          # [NEW] Komponen Seksi 3.8: Galeri Foto Editorial
│       ├── GalleryMasonry.test.tsx     # [NEW] Unit test TDD untuk GalleryMasonry
│       ├── LightboxModal.tsx           # [NEW] Komponen Modal Lightbox Bergestur Sentuh
│       └── LightboxModal.test.tsx      # [NEW] Unit test TDD untuk LightboxModal
└── app/
    └── page.tsx                        # [MODIFY] Mengintegrasikan kedua seksi baru ke dalam flow utama

tests/
└── app/
    └── page.test.tsx                   # [MODIFY] Memperbarui integrasi page test untuk seksi 3.7 & 3.8
```

**Structure Decision**: Mengikuti arsitektur terisolasi standar proyek Next.js 15 App Router. Seluruh komponen seksi baru ditempatkan di `src/components/sections/` dengan berkas tes terko-lokasi (*co-located unit tests*), menjaga keterbacaan kode dan memudahkan pemeliharaan jangka panjang.

---

## Complexity Tracking

*Tidak ada pelanggaran atau deviasi terhadap prinsip Konstitusi Proyek. Seluruh arsitektur mematuhi standar minimalis `/ponytail full` dan SSoT `DESIGN.md`.*
