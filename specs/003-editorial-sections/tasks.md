# Tasks: Seksi Halaman Utama & Narasi Editorial (Fase 3A)

**Feature**: `003-editorial-sections`  
**Plan**: [`specs/003-editorial-sections/plan.md`](./plan.md)  
**Spec**: [`specs/003-editorial-sections/spec.md`](./spec.md)  

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Menyiapkan struktur direktori komponen editorial dan memvalidasi kelengkapan token desain.

- [x] T001 Membuat struktur direktori komponen di `src/components/layout/` dan `src/components/sections/`
- [x] T002 Memvalidasi ketersediaan token warna Surakarta dan font Google di `src/app/globals.css` dan `tailwind.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Menyediakan model data editorial statis dan modul utilitas dasar yang dibutuhkan oleh seluruh seksi editorial.

**⚠️ CRITICAL**: Seluruh tugas fondasi ini wajib diselesaikan sebelum implementasi seksi editorial dimulai.

- [x] T003 [P] Mendefinisikan antarmuka dan konstanta data editorial statis di `src/lib/config/wedding-content.ts`
- [x] T004 [P] Menulis unit test untuk utilitas kalender di `src/lib/utils/calendar.test.ts`
- [x] T005 Mengimplementasikan generator URL Google Calendar dan berkas RFC 5545 `.ics` di `src/lib/utils/calendar.ts`
- [x] T006 [P] Menulis unit test untuk custom hook waktu mundur di `src/hooks/useCountdown.test.ts`
- [x] T007 Mengimplementasikan custom hook reaktif `useCountdown` dengan pelindung hidrasi SSR di `src/hooks/useCountdown.ts`

**Checkpoint**: Fondasi konfigurasi data dan helper utilitas siap digunakan oleh seluruh user story.

---

## Phase 3: User Story 1 - Menikmati Sampul Editorial dan Pembuka Kemewahan (Priority: P1) 🎯 MVP

**Goal**: Menyajikan sampul majalah editorial sinematik berlayar penuh dengan Didone typography *Bodoni Moda* dan transisi gradasi hangat Malam Wulung.

**Independent Test**: Mengakses halaman utama setelah gerbang amplop terbuka dan memverifikasi tampilan sampul berlayar penuh (`min-h-screen`), kontras tinggi teks nama mempelai, tanggal formal, dan transisi CSS fade ke seksi bawahnya.

### Tests for User Story 1 (Test-Driven Development) ⚠️
- [x] T008 [P] [US1] Menulis unit test untuk komponen HeroSection di `src/components/sections/HeroSection.test.tsx`

### Implementation for User Story 1
- [x] T009 [US1] Mengimplementasikan komponen sampul majalah editorial `HeroSection` di `src/components/sections/HeroSection.tsx`

**Checkpoint**: User Story 1 selesai dan dapat diuji secara mandiri sebagai MVP visual pertama.

---

## Phase 4: User Story 2 - Menyimak Ayat Suci Al-Qur'an dan Doa Restu Sakral (Priority: P2)

**Goal**: Menampilkan kaligrafi Arab Surat Ar-Rum ayat 21 berkualitas tinggi (font Amiri), terjemahan puitis bahasa Indonesia, dan doa sunnah pernikahan dengan animasi kemunculan bertingkat.

**Independent Test**: Menggulir ke seksi ayat suci dan memverifikasi ketajaman teks Arab dengan harakat lengkap, orientasi kanan-ke-kiri (*RTL*), atribut aksesibilitas, serta terjemahan santun berlatar Gading Keraton berornamen Kawung 5%.

### Tests for User Story 2 (Test-Driven Development) ⚠️
- [x] T010 [P] [US2] Menulis unit test untuk komponen IslamicQuotes di `src/components/sections/IslamicQuotes.test.tsx`

### Implementation for User Story 2
- [x] T011 [US2] Mengimplementasikan komponen `IslamicQuotes` dengan font Arab Amiri dan staggered reveal di `src/components/sections/IslamicQuotes.tsx`

**Checkpoint**: User Story 2 selesai dan berfungsi harmonis berdampingan dengan User Story 1.

---

## Phase 5: User Story 3 - Mengenal Sosok dan Silsilah Kedua Mempelai (Priority: P3)

**Goal**: Menyajikan profil mempelai pria dan wanita dengan foto potret berbingkai kubah keraton (*arch/ogee*), silsilah keluarga terhormat, dan tautan sosial santun dalam tata letak responsif.

**Independent Test**: Memverifikasi tampilan profil: stack vertikal di layar ponsel dengan pemisah Truntum dan ampersand di tengah, serta 2 kolom berdampingan (*editorial spread*) di layar desktop.

### Tests for User Story 3 (Test-Driven Development) ⚠️
- [x] T012 [P] [US3] Menulis unit test untuk komponen CoupleProfile di `src/components/sections/CoupleProfile.test.tsx`

### Implementation for User Story 3
- [x] T013 [US3] Mengimplementasikan komponen `CoupleProfile` dengan bingkai kubah ogee di `src/components/sections/CoupleProfile.tsx`

**Checkpoint**: User Story 3 selesai dan teruji mandiri.

---

## Phase 6: User Story 4 - Memantau Waktu Mundur Menuju Hari Bahagia (Priority: P4)

**Goal**: Menyediakan timer hitung mundur reaktif 4 kolom waktu (Hari, Jam, Menit, Detik) dengan font angka tabular *Bodoni Moda* dan siluet bingkai Gunungan Prada Emas.

**Independent Test**: Memverifikasi bahwa angka berkurang akurat setiap detik tanpa getaran lebar layout (*tabular nums*), pemisah titik dua berdenyut halus, dan status pasca-acara ditangani secara formal.

### Tests for User Story 4 (Test-Driven Development) ⚠️
- [x] T014 [P] [US4] Menulis unit test untuk komponen CountdownSection di `src/components/sections/CountdownSection.test.tsx`

### Implementation for User Story 4
- [x] T015 [US4] Mengimplementasikan komponen `CountdownSection` berbingkai Gunungan Prada di `src/components/sections/CountdownSection.tsx`

**Checkpoint**: User Story 4 selesai dan teruji mandiri.

---

## Phase 7: User Story 5 - Memeriksa Rangkaian Acara dan Mengintegrasikan Jadwal/Lokasi (Priority: P5)

**Goal**: Menyajikan rincian sesi Akad Nikah dan Resepsi Pernikahan berformat *left-aligned* dengan integrasi popover Google Calendar, unduh berkas `.ics`, serta tombol peta venue (Google Maps & Waze).

**Independent Test**: Menguji klik tombol "Tambah ke kalender" (membuka tab Google Calendar & mengunduh berkas `.ics`) serta klik tombol "Buka peta venue" (mengarahkan ke koordinat lokasi resmi gedung).

### Tests for User Story 5 (Test-Driven Development) ⚠️
- [x] T016 [P] [US5] Menulis unit test untuk komponen EventDetails di `src/components/sections/EventDetails.test.tsx`

### Implementation for User Story 5
- [x] T017 [US5] Mengimplementasikan komponen `EventDetails` dengan integrasi kalender dan navigasi peta di `src/components/sections/EventDetails.tsx`

**Checkpoint**: User Story 5 selesai dan teruji mandiri.

---

## Phase 8: User Story 6 - Mengalami Pengguliran Halaman yang Sangat Halus dan Alami (Priority: P6)

**Goal**: Mengorkestrasi pengguliran inersia Lenis di desktop dan scroll sentuh native 60–120 FPS di ponsel pintar, terintegrasi dengan penguncian scroll saat amplop virtual masih tertutup.

**Independent Test**: Menguji penguncian scroll saat amplop tertutup, transisi mulus saat amplop dibuka, inersia mouse wheel di desktop, dan kelancaran 60 FPS pada layar sentuh ponsel.

### Tests for User Story 6 (Test-Driven Development) ⚠️
- [x] T018 [P] [US6] Menulis unit test untuk SmoothScrollProvider di `src/components/layout/SmoothScrollProvider.test.tsx`

### Implementation for User Story 6
- [x] T019 [US6] Mengimplementasikan wrapper client `SmoothScrollProvider` berbasis Lenis di `src/components/layout/SmoothScrollProvider.tsx`
- [x] T020 [US6] Mengintegrasikan `SmoothScrollProvider` dan seluruh seksi editorial ke dalam halaman utama di `src/app/page.tsx`

**Checkpoint**: Seluruh alur halaman utama (User Story 1 s/d 6) tersambung secara utuh dan mengalir mulus.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Verifikasi menyeluruh terhadap aksesibilitas, performa 60 FPS, dan pemenuhan seluruh gerbang kualitas Definition of Done (DoD).

- [x] T021 [P] Memverifikasi kepatuhan aksesibilitas (kontras WCAG AA, atribut RTL pada teks Arab, dan target sentuh minimal 44×44px)
- [x] T022 [P] Memverifikasi query media `prefers-reduced-motion` pada HeroSection, IslamicQuotes, dan CountdownSection
- [x] T023 Menjalankan pengujian otomatis penuh menggunakan `pnpm test` (wajib 100% lulus)
- [x] T024 Menjalankan verifikasi tipe statis menggunakan `pnpm typecheck` (wajib 0 error)
- [x] T025 Menjalankan pemeriksaan gaya kode dan kebersihan menggunakan `pnpm lint` (wajib 0 warning/error)
- [x] T026 Melakukan verifikasi manual browser mengikuti skenario di `specs/003-editorial-sections/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Tanpa ketergantungan — dapat langsung dijalankan.
- **Foundational (Phase 2)**: Bergantung pada Phase 1 — **MEMBLOKIR** seluruh user stories.
- **User Stories (Phase 3 s/d 8)**: Bergantung pada penyelesaian Phase 2.
  - Dapat dieksekusi berurutan sesuai prioritas (US1 $\rightarrow$ US2 $\rightarrow$ US3 $\rightarrow$ US4 $\rightarrow$ US5 $\rightarrow$ US6) atau secara paralel.
- **Polish (Phase 9)**: Bergantung pada penyelesaian seluruh User Story (US1–US6).

### User Story Dependencies
- **US1 (P1 - Hero)**: Dapat langsung dimulai setelah Foundational selesai.
- **US2 (P2 - Islamic Quotes)**: Bergantung pada data di `wedding-content.ts`.
- **US3 (P3 - Couple Profile)**: Bergantung pada data di `wedding-content.ts`.
- **US4 (P4 - Countdown)**: Bergantung pada hook `useCountdown.ts` (Phase 2).
- **US5 (P5 - Event Details)**: Bergantung pada helper `calendar.ts` (Phase 2).
- **US6 (P6 - Smooth Scroll & Page Integration)**: Mengintegrasikan US1–US5 ke dalam `page.tsx`.

---

## Parallel Execution Examples

### Parallel Unit Tests (Phase 2)
```bash
# Menjalankan penulisan tes fondasi secara paralel:
Task: "Menulis unit test untuk utilitas kalender di src/lib/utils/calendar.test.ts"
Task: "Menulis unit test untuk custom hook waktu mundur di src/hooks/useCountdown.test.ts"
```

### Parallel User Story Components (Phase 3–7)
```bash
# Setelah Foundational selesai, komponen seksi editorial dapat dikerjakan secara paralel:
Task: "src/components/sections/HeroSection.tsx"
Task: "src/components/sections/IslamicQuotes.tsx"
Task: "src/components/sections/CoupleProfile.tsx"
Task: "src/components/sections/CountdownSection.tsx"
Task: "src/components/sections/EventDetails.tsx"
```

---

## Implementation Strategy

### MVP First (Fokus Awal pada User Story 1)
1. Selesaikan Phase 1 (Setup) dan Phase 2 (Foundational).
2. Selesaikan Phase 3 (HeroSection sebagai pembuka visual utama).
3. **Validasi**: Uji kelancaran render sampul majalah editorial.

### Incremental Delivery (Pengembangan Bertahap)
1. Tambahkan Seksi Ayat Suci (US2) $\rightarrow$ Uji render kaligrafi Arab & terjemahan.
2. Tambahkan Seksi Profil Mempelai (US3) $\rightarrow$ Uji layout responsif kubah ogee.
3. Tambahkan Seksi Countdown (US4) $\rightarrow$ Uji keakuratan timer dan tabular numerals.
4. Tambahkan Seksi Jadwal Acara (US5) $\rightarrow$ Uji integrasi Google Calendar, `.ics`, dan Google Maps.
5. Integrasikan seluruh seksi ke dalam `page.tsx` dengan Lenis Smooth Scroll (US6).
6. Jalankan audit kualitas DoD (Phase 9): `pnpm test`, `pnpm typecheck`, `pnpm lint`.
