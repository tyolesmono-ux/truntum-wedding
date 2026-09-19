# Research & Architectural Decisions: Seksi Linimasa Kisah Cinta & Galeri Sinematik (Fase 3B)

**Feature**: `003b-editorial-story-gallery`  
**Date**: 2026-09-19  
**Status**: Completed  
**Acuan SSoT**: [`DESIGN.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/DESIGN.md), [`PRD.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/PRD.md), [Constitution](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/.specify/memory/constitution.md)

---

## 1. Animasi Garis Progres Linimasa Terikat Scroll (Scroll-Linked Progress Line)

### Decision
Menggunakan hook `useScroll` dan `useTransform` dari `motion/react` dengan `target` merujuk ke elemen kontainer linimasa (`useRef<HTMLDivElement>`) dan `offset: ["start center", "end center"]`. Progres scroll diterjemahkan ke properti GPU-composited `scaleY` (dengan `transformOrigin: "top"`) pada elemen garis vertikal Prada Emas (`#C2A05B`).

### Rationale
1. **Akselerasi GPU Murni**: Mengubah `scaleY` (bukan `height`) berjalan pada thread *compositor* browser tanpa memicu kalkulasi ulang tata letak (*reflow / layout shift*), mempertahankan performa 60 FPS pada iPhone 12/13/14 dan Android mid-range.
2. **Kesesuaian dengan Motion v11 & React 19**: Sintaks `useScroll({ target: containerRef, offset: [...] })` telah diverifikasi melalui `context7` pada pustaka `motion` (`motion/react`) versi `^11.11.7`.
3. **Pemberhentian Elegan saat Reduced Motion**: Saat `prefers-reduced-motion: reduce` aktif, garis vertikal dirender dengan `scaleY: 1` statis tanpa *listener* scroll aktif.

### Alternatives Considered
- **CSS `@keyframes` berbasis ScrollTimeline**: Fitur native CSS ScrollTimeline belum didukung secara konsisten di seluruh versi mobile Safari/WebKit (iOS < 18).
- **Manual Scroll Event Listener (`window.addEventListener('scroll')`)**: Menghasilkan *overhead* pada thread utama JavaScript dan membutuhkan debounce/throttle manual yang rentan terhadap stutter.

---

## 2. Penanganan Gestur Sentuh Ponsel pada Modal Lightbox (Swipe & Dismiss)

### Decision
Menerapkan penanganan gestur sentuh *hybrid* yang menggabungkan kemampuan `motion.div` dengan *touch handlers* native (`onTouchStart`, `onTouchMove`, `onTouchEnd`):
1. **Horizontal Swipe**: Mendeteksi translasi horizontal $\Delta X > 60\text{px}$ dengan kecepatan memadai untuk berpindah ke foto sebelumnya (`ArrowLeft`) atau berikutnya (`ArrowRight`).
2. **Swipe-down to Dismiss**: Mendeteksi translasi vertikal positif ke bawah $\Delta Y > 100\text{px}$ untuk menutup modal Lightbox secara alami ala iOS Photos, dengan animasi *fade-out & scale-down*.
3. **Double-Tap to Zoom**: Menghitung selisih waktu antara dua ketukan berturut-turut ($< 300\text{ms}$). Ketukan ganda pertama memperbesar gambar ke skala 2× (*scale: 2*), ketukan ganda berikutnya mengembalikan ke skala 1×.
4. **Resistansi Batas (*Rubber-Band*)**: Saat berada di indeks pertama dan tamu mengusap ke kanan (atau foto terakhir mengusap ke kiri), pergeseran visual dibatasi hingga $\pm 30\text{px}$ dengan elastisitas logaritmik sebelum memantul kembali ke titik nol.

### Rationale
- Memberikan nuansa aplikasi seluler kelas atas (*native app feel*) pada browser seluler tanpa menambahkan pustaka gestur eksternal pihak ketiga (seperti Hammer.js atau Embla), mematuhi prinsip `/ponytail full` dan menjaga ukuran bundle $\le 90\text{ KB}$.

### Alternatives Considered
- **Menginstal Pustaka Lightbox Eksternal (misal: Yet Another React Lightbox / PhotoSwipe)**: Ditolak karena menambah ukuran bundle (> 25 KB), rawan konflik styling dengan tema Tailwind Surakarta, dan melanggar prinsip kemandirian kode (*YAGNI & dependency restraint*).

---

## 3. Sinkronisasi Penguncian Pengguliran Layar Latar (Lenis Scroll Locking)

### Decision
Ketika modal Lightbox dibuka (`isOpen === true`):
1. Memanggil instance Lenis smooth scroll untuk berhenti: `window.__lenis?.stop()` atau via context Lenis.
2. Menambahkan kelas utilitas penguncian scroll pada `document.body`: `overflow: hidden; touch-action: none;`.
3. Ketika modal ditutup, panggil `window.__lenis?.start()` dan kembalikan `document.body.style.overflow = ''`.

### Rationale
- Menghindari pergeseran posisi baca latar belakang saat pengunjung mengusap jari di atas modal Lightbox.
- Menjaga kelancaran integrasi antara Lenis di desktop dan browser native di ponsel.

### Alternatives Considered
- **Hanya `overflow: hidden` pada `<body>`**: Pada peramban iOS Safari mobile, `overflow: hidden` saja terkadang tetap membiarkan latar belakang bergeser jika inersia momentum scroll masih aktif. Menghentikan Lenis secara eksplisit menjamin penguncian mutlak.

---

## 4. Transisi Tepi Latar Belakang Gelap Malam Wulung (`#15120F`)

### Decision
Menggunakan penataan kontainer CSS terisolasi:
- Seksi Love Story diawali dengan *top gradient border*: `bg-gradient-to-b from-[#FCFAF5] to-[#15120F]` setinggi 96px, menghasilkan degradasi warna yang sangat halus dari latar seksi Rangkaian Acara (Melati) ke Malam Wulung.
- Seluruh teks di dalam Love Story dan Galeri menggunakan token kontras tinggi: `--fg-on-dark` (`#EFE6D6`), `--fg-muted-dark` (`#A89680`), dan aksen Prada Emas (`#C2A05B`).
- Seksi Galeri ditutup dengan batas transisi menuju seksi Hadiah Digital (Fase 4 - Gading Keraton `#F6F1E7`).

### Rationale
- Tidak ada konsumsi siklus CPU/GPU untuk mendengarkan posisi scroll (*zero JavaScript paint overhead*), menghasilkan scrolling 60 FPS yang stabil.

---

## 5. Ringkasan Resolusi Ambang Batas Teknis

| Parameter | Spesifikasi SSoT | Implementasi yang Dipilih |
| :--- | :--- | :--- |
| **Pustaka Animasi** | Motion v11 (`motion/react`) | `useScroll`, `useTransform`, `AnimatePresence`, `motion.div` |
| **Ukuran Bundle JS** | $\le 90\text{ KB}$ gzipped | Komponen Lightbox dimuat secara dinamis saat diperlukan (`next/dynamic` atau kondisional) |
| **Gradasi Aset Gambar** | Hangat (temp +6, sat -8) | Dikonfigurasi pada deskripsi metadata foto dengan filter visual CSS fallback |
| **Placeholder Foto** | `#E8DCC8` (Kertas Batik) | `blurDataURL` berbasis SVG/solid color Kertas Batik, bukan warna abu-abu generik |
