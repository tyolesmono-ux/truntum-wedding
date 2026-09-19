# Quickstart & Validation Guide: Seksi Linimasa Kisah Cinta & Galeri Sinematik (Fase 3B)

**Feature**: `003b-editorial-story-gallery`  
**Date**: 2026-09-19  
**Status**: Ready for Implementation  

Panduan ini berisi skenario verifikasi menyeluruh untuk menguji implementasi Seksi Linimasa Kisah Cinta (`LoveStoryTimeline`) dan Galeri Sinematik + Lightbox (`GalleryMasonry` & `LightboxModal`) baik secara otomatis maupun manual.

---

## 1. Prasyarat & Lingkungan Uji

Pastikan seluruh dependensi telah terpasang dan berada pada branch kerja:

```bash
# Pastikan berada di root proyek
cd /home/disnakerska/Documents/Project/luxury-wedding-invitation

# Verifikasi status git
git status
```

---

## 2. Pengujian Unit Otomatis (Automated Unit Tests - TDD)

Setiap komponen dilengkapi dengan unit test Vitest + React Testing Library yang dapat dijalankan secara terisolasi:

### 2.1 Menjalankan Seluruh Pengujian Fase 3B
```bash
# Menjalankan unit test spesifik untuk seksi Love Story dan Galeri
pnpm test src/components/sections/LoveStoryTimeline.test.tsx
pnpm test src/components/sections/GalleryMasonry.test.tsx
pnpm test src/components/sections/LightboxModal.test.tsx
```

### 2.2 Menjalankan Seluruh Rangkaian Pengujian Proyek
```bash
# Wajib 100% lulus tanpa kegagalan
pnpm test
```

### 2.3 Verifikasi Tipe Statis & Gaya Kode
```bash
# Memastikan nol error tipe TypeScript (strict: true)
pnpm typecheck

# Memastikan nol warning dan error linting
pnpm lint
```

---

## 3. Verifikasi Manual Interaktif di Browser

Jalankan server pengembangan lokal:

```bash
pnpm dev
```

Buka URL lokal di browser (default: `http://localhost:3000`).

### Skenario 1: Verifikasi Seksi Love Story (Garis Waktu Terikat Scroll)
1. Buka amplop virtual dengan mengetuk segel lilin monogram.
2. Gulir layar ke bawah melewati seksi Hero, Ayat Suci, Profil Mempelai, Countdown, dan Rangkaian Acara.
3. Perhatikan transisi latar belakang dari terang (Melati `#FCFAF5`) ke gelap temaram Malam Wulung (`#15120F`) dengan tepi gradasi yang halus.
4. Gulir perlahan melintasi seksi Love Story:
   - Amati garis vertikal emas di sisi kiri (*left-rail*) yang terisi secara mulus dari atas ke bawah.
   - Amati penanda titik emas (*node*) yang berkilau lembut saat terlewati garis progres.
   - Periksa tipografi tahun Didone *Bodoni Moda* dan teks narasi santun *Jost* yang memiliki kontras tinggi terhadap latar gelap.

### Skenario 2: Verifikasi Seksi Galeri Asimetris
1. Lanjutkan menggulir ke seksi Galeri Foto Sinematik.
2. Periksa susunan asimetris:
   - Foto lanskap 16:9 membentang memenuhi lebar layar (*full-width*).
   - Foto potret 3:4 tersusun berdampingan dalam dua kolom tanpa celah tepi luar (*full-bleed*).
3. Pastikan tidak ada pergeseran tata letak saat foto dimuat (*zero layout shift*).

### Skenario 3: Verifikasi Modal Lightbox & Gestur Sentuh
1. Ketuk salah satu thumbnail foto di galeri:
   - Pastikan modal Lightbox terbuka dengan animasi skala halus dan latar belakang temaram transparan pekat.
   - Periksa bilah atas: indikator nomor foto (misal: "01 / 07") berformat angka tabular dan tombol tutup (X).
   - Periksa bilah bawah: teks keterangan foto (*caption*) berfont *Jost* 14px terbaca jelas.
2. Uji penguncian scroll:
   - Coba gulir roda mouse atau usap latar belakang; pastikan halaman utama di belakang modal tidak ikut bergeser (*Lenis locked*).
3. Uji navigasi keyboard (desktop):
   - Tekan tombol panah kanan (`ArrowRight`) $\rightarrow$ berpindah ke foto berikutnya ("02 / 07").
   - Tekan tombol panah kiri (`ArrowLeft`) $\rightarrow$ kembali ke foto sebelumnya.
   - Tekan tombol `Escape` $\rightarrow$ modal tertutup dan pengguliran halaman kembali aktif.
4. Uji gestur sentuh (pada mode Device Simulation ponsel di DevTools atau perangkat fisik):
   - Buka modal foto, lalu usap ke kiri (*swipe left*) $\rightarrow$ foto berganti ke berikutnya.
   - Usap ke bawah (*swipe down*) $\rightarrow$ modal tertutup secara alami (*swipe-to-dismiss*).
   - Lakukan ketukan ganda (*double-tap*) $\rightarrow$ foto membesar (zoom 2×), ketuk ganda lagi untuk kembali ke 1×.

### Skenario 4: Verifikasi Preferensi `prefers-reduced-motion`
1. Aktifkan emulasi reduced motion di Chrome DevTools (`Rendering` $\rightarrow$ `Emulate CSS media feature prefers-reduced-motion: reduce`).
2. Refresh halaman dan gulir ke Love Story:
   - Garis vertikal emas harus tampil terisi penuh secara statis tanpa animasi kalkulasi scroll.
   - Modal Lightbox harus terbuka dan tertutup secara instan tanpa efek zoom/skala transisi.
