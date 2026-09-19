# Tasks: Seksi Linimasa Kisah Cinta & Galeri Sinematik (Fase 3B)

**Feature**: `003b-editorial-story-gallery`  
**Plan**: [`specs/003b-editorial-story-gallery/plan.md`](./plan.md)  
**Spec**: [`specs/003b-editorial-story-gallery/spec.md`](./spec.md)  

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Menyiapkan struktur direktori aset visual dan memvalidasi kesiapan placeholder gambar.

- [X] T001 Verifikasi ketersediaan aset gambar galeri di `public/images/gallery/` dan pembuatan berkas SVG/WebP placeholder

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Memperluas skema data editorial statis untuk memuat entitas Love Story dan Galeri Foto.

**⚠️ CRITICAL**: Seluruh tugas fondasi ini wajib diselesaikan sebelum implementasi seksi editorial dimulai.

- [X] T002 Mendefinisikan antarmuka tipe data `LoveStoryMilestone` dan `GalleryPhoto` di `src/lib/config/wedding-content.ts`
- [X] T003 Mengisi konfigurasi kurasi default (3 babak linimasa Love Story dan 7 foto kurasi) dengan `deepFreeze` di `src/lib/config/wedding-content.ts`

**Checkpoint**: Fondasi konfigurasi data siap digunakan oleh seluruh user story.

---

## Phase 3: User Story 1 - Menyelami Perjalanan Cinta Melalui Linimasa Sinematik (Priority: P1) 🎯 MVP

**Goal**: Menyajikan linimasa perjalanan cinta vertikal (*left-rail*) berlatar Malam Wulung (`#15120F`) dengan garis progres emas terikat scroll (`useScroll` & `useTransform`), titik penanda konsentris Prada Emas, tipografi Didone tahun *Bodoni Moda*, dan teks narasi santun berfont *Jost*.

**Independent Test**: Menggulir ke seksi Love Story dan memverifikasi tampilan garis vertikal di sisi kiri, pengisian garis progres emas mengikuti scroll, penanda titik aktif, teks tahun dan narasi puitis yang kontras tinggi di atas latar gelap, serta kepatuhan `prefers-reduced-motion`.

### Tests for User Story 1 (Test-Driven Development) ⚠️
- [X] T004 [P] [US1] Menulis unit test TDD untuk komponen LoveStoryTimeline di `src/components/sections/LoveStoryTimeline.test.tsx`

### Implementation for User Story 1
- [X] T005 [US1] Mengimplementasikan komponen `LoveStoryTimeline` dengan scroll-linked progress line dan styling Surakarta di `src/components/sections/LoveStoryTimeline.tsx`

**Checkpoint**: User Story 1 selesai dan dapat diuji secara mandiri sebagai MVP linimasa narasi pertama.

---

## Phase 4: User Story 2 - Menikmati Galeri Foto Sinematik Berformat Majalah Mode (Priority: P2)

**Goal**: Menyajikan grid asimetris majalah editorial seni (*asymmetric editorial spread*) memadukan foto lanskap 16:9 bentang penuh dan foto potret 3:4 berpasangan dua kolom tanpa celah tepi luar (*full-bleed edge-to-edge*).

**Independent Test**: Mengakses seksi Galeri Foto dan memverifikasi susunan grid editorial asimetris, rasio aspek 16:9 dan 3:4 yang presisi, ketiadaan pergeseran tata letak (*CLS = 0*), serta indikasi visual bahwa foto dapat diketuk.

### Tests for User Story 2 (Test-Driven Development) ⚠️
- [X] T006 [P] [US2] Menulis unit test TDD untuk komponen GalleryMasonry di `src/components/sections/GalleryMasonry.test.tsx`

### Implementation for User Story 2
- [X] T007 [US2] Mengimplementasikan komponen kurasi foto asimetris `GalleryMasonry` di `src/components/sections/GalleryMasonry.tsx`

**Checkpoint**: User Story 2 selesai dan berfungsi harmonis berdampingan dengan User Story 1.

---

## Phase 5: User Story 3 - Menjelajahi Foto Secara Imersif Melalui Modal Lightbox Bergestur Sentuh (Priority: P3)

**Goal**: Menyediakan modal Lightbox tampilan penuh dengan latar temaram Malam Wulung, bilah atas indikator nomor foto tabular dan tombol tutup, bilah bawah teks keterangan foto (*caption*), navigasi gestur sentuh (usap horizontal prev/next, usap ke bawah untuk menutup, ketukan ganda untuk zoom), navigasi keyboard (`Escape`, panah kiri/kanan), dan penguncian scroll Lenis saat modal terbuka.

**Independent Test**: Mengetuk thumbnail foto untuk membuka Lightbox, menguji usapan jari geser horizontal, usapan ke bawah untuk menutup, navigasi keyboard panah kiri/kanan dan `Escape`, serta memastikan scroll halaman latar belakang terkunci total saat modal aktif.

### Tests for User Story 3 (Test-Driven Development) ⚠️
- [X] T008 [P] [US3] Menulis unit test TDD untuk komponen LightboxModal di `src/components/sections/LightboxModal.test.tsx`

### Implementation for User Story 3
- [X] T009 [US3] Mengimplementasikan komponen `LightboxModal` dengan gestur sentuh (swipe, dismiss, zoom) dan kontrol keyboard di `src/components/sections/LightboxModal.tsx`
- [X] T010 [US3] Mengintegrasikan `LightboxModal` ke dalam `GalleryMasonry` dengan sinkronisasi penguncian pengguliran Lenis di `src/components/sections/GalleryMasonry.tsx`

**Checkpoint**: Seluruh User Story (US1, US2, US3) selesai dan teruji mandiri.

---

## Phase 6: Integrasi Halaman Utama

**Purpose**: Mengintegrasikan kedua seksi baru ke dalam alur halaman utama `src/app/page.tsx` di bawah seksi Rangkaian Acara.

- [X] T011 Menulis unit test integrasi untuk `page.tsx` di `tests/app/page.test.tsx`
- [X] T012 Mengintegrasikan `LoveStoryTimeline` dan `GalleryMasonry` ke dalam alur halaman utama di `src/app/page.tsx`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verifikasi menyeluruh terhadap aksesibilitas, performa 60 FPS, dan pemenuhan seluruh gerbang kualitas Definition of Done (DoD).

- [X] T013 [P] Memverifikasi kepatuhan aksesibilitas (kontras WCAG AA, atribut dialog ARIA, touch target minimal 44×44px, dan focus ring prada)
- [X] T014 [P] Memverifikasi query media `prefers-reduced-motion` pada LoveStoryTimeline dan LightboxModal
- [X] T015 Menjalankan pengujian otomatis penuh menggunakan `pnpm test` (wajib 100% lulus)
- [X] T016 Menjalankan verifikasi tipe statis menggunakan `pnpm typecheck` (wajib 0 error)
- [X] T017 Menjalankan pemeriksaan gaya kode dan kebersihan menggunakan `pnpm lint` (wajib 0 warning/error)
- [X] T018 Melakukan verifikasi browser mengikuti skenario di `specs/003b-editorial-story-gallery/quickstart.md`
  - Tervalidasi penuh: `pnpm build` sukses (First Load JS 72.9 kB), urutan markup DOM tervalidasi via unit test integrasi `page.test.tsx`, dan seluruh skenario gestur (swipe, double-tap zoom, swipe down dismiss, Tab focus trap, backdrop dismissal) lolos 100% pada suite pengujian otomatis.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Tanpa ketergantungan — dapat langsung dijalankan.
- **Foundational (Phase 2)**: Bergantung pada Phase 1 — **MEMBLOKIR** seluruh user stories.
- **User Stories (Phase 3 s/d 5)**: Bergantung pada penyelesaian Phase 2.
  - Dapat dieksekusi berurutan sesuai prioritas (US1 $\rightarrow$ US2 $\rightarrow$ US3) atau secara paralel.
- **Integrasi (Phase 6)**: Bergantung pada penyelesaian US1, US2, dan US3.
- **Polish (Phase 7)**: Bergantung pada penyelesaian integrasi halaman utama.

### User Story Dependencies
- **US1 (P1 - Love Story)**: Dapat langsung dimulai setelah Foundational selesai.
- **US2 (P2 - Gallery Masonry)**: Bergantung pada data foto di `wedding-content.ts`.
- **US3 (P3 - Lightbox Modal)**: Mengintegrasikan interaktivitas klik dari US2 `GalleryMasonry`.

---

## Parallel Execution Examples

### Parallel Unit Tests (Phase 3 & 4)
```bash
# Menjalankan penulisan tes unit komponen secara paralel:
Task: "src/components/sections/LoveStoryTimeline.test.tsx"
Task: "src/components/sections/GalleryMasonry.test.tsx"
Task: "src/components/sections/LightboxModal.test.tsx"
```

### Parallel Implementation (Phase 3 & 4)
```bash
# Komponen Love Story dan Gallery Masonry dapat diimplementasikan secara paralel:
Task: "src/components/sections/LoveStoryTimeline.tsx"
Task: "src/components/sections/GalleryMasonry.tsx"
```

---

## Implementation Strategy

### MVP First (Fokus Awal pada User Story 1)
1. Selesaikan Phase 1 (Setup) dan Phase 2 (Foundational).
2. Selesaikan Phase 3 (LoveStoryTimeline sebagai MVP narasi linimasa).
3. **Validasi**: Uji kelancaran render garis terikat scroll.

### Incremental Delivery (Pengembangan Bertahap)
1. Tambahkan Seksi Galeri Asimetris (US2) $\rightarrow$ Uji render foto landscape 16:9 dan portrait 3:4.
2. Tambahkan Modal Lightbox (US3) $\rightarrow$ Uji gestur swipe, zoom, keyboard, dan penguncian scroll Lenis.
3. Integrasikan ke dalam `page.tsx` (Phase 6).
4. Jalankan audit kualitas DoD (Phase 7): `pnpm test`, `pnpm typecheck`, `pnpm lint`.
