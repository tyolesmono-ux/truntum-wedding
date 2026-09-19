# Technical Research: Gerbang Pembuka (3D Virtual Envelope) & Audio Engine

**Feature**: `002-virtual-envelope-audio`  
**Date**: 2026-09-19  
**Status**: Completed & Verified

---

## 1. Konstruksi 3D Virtual Envelope: CSS 3D Layered Transforms vs WebGL / Three.js

- **Keputusan**: Menggunakan CSS 3D Transforms (`perspective: 1200px`, `transform-style: preserve-3d`, `rotateX`) dikombinasikan dengan `motion/react` variants.
- **Rasional**:
  - Ukuran bundle JavaScript awal dibatasi maksimal 90 KB gzipped (Prinsip IV Konstitusi). Menambahkan Three.js (~500 KB uncompressed) akan melanggar anggaran kinerja secara fatal.
  - CSS 3D transforms berjalan pada GPU compositor thread ponsel pintar tanpa membebani main thread.
  - Flap amplop dengan `transform-origin: top` dan `rotateX: 0 -> -180deg` memberikan ilusi fisik lipatan amplop yang realistis dengan nol dependensi eksternal.
- **Alternatif yang Dipertimbangkan**:
  - *Three.js / React Three Fiber*: Ditolak karena bundle size terlalu besar (~500 KB+), konsumsi baterai tinggi di perangkat seluler, dan melanggar prinsip *Ponytail Full* (YAGNI).
  - *Sprite-sheet Canvas 2D*: Ditolak karena tidak responsif terhadap resolusi layar retina dan menambah beban aset gambar statis berukuran megabyte.

---

## 2. Web Audio API Engine: MediaElementAudioSourceNode + GainNode vs Howler.js / Pure HTML5 Audio

- **Keputusan**: Membangun arsitektur kustom native berbasis Web Audio API: `AudioContext.createMediaElementSource(audioEl)` disambungkan ke `GainNode` dan berakhir di `audioContext.destination`.
- **Rasional**:
  - `MediaElementAudioSourceNode` memungkinkan *progressive streaming* dari file audio ambient lokal (`/audio/wedding-ambient.mp3`) tanpa perlu mendownload dan mendecode seluruh file buffer ke memori RAM ponsel.
  - `GainNode` menyediakan metode presisi tinggi `linearRampToValueAtTime` untuk kurva kenaikan volume linier $0.0 \rightarrow 0.8$ selama tepat $2.5$ detik, serta *micro-fade* 150ms saat jeda/putar untuk mencegah distorsi suara retak (*clipping pop*).
  - Menghemat dependensi eksternal: tidak membutuhkan pustaka pihak ketiga seperti Howler.js (mengikuti prinsip *Ladder of Restraint*).
- **Alternatif yang Dipertimbangkan**:
  - *Howler.js*: Ditolak karena menambahkan dependensi tambahan ~10 KB yang tidak diperlukan; fungsionalitas Web Audio API native sudah mencakup seluruh kebutuhan.
  - *Pure HTMLAudioElement Volume Ramping (setInterval)*: Ditolak sebagai jalur utama karena kurva volume interval JavaScript di main thread rentan mengalami *jank* (lag) saat ada animasi UI. Namun, dipertahankan sebagai *graceful fallback* jika browser menolak Web Audio API.

---

## 3. Kepatuhan Kebijakan Autoplay Browser Modern (iOS Safari / Blink)

- **Keputusan**: Audio engine berada dalam status *suspended* dan diam sampai pengunjung melakukan gestur sentuh fisik pada segel lilin (`WaxSeal`) atau tombol `"Buka undangan"`.
- **Rasional**:
  - iOS Safari dan Chrome Android memblokir total pemanggilan `.play()` atau pembuatan suara sebelum ada *user gesture* fisik.
  - Pelanggaran autoplay akan memicu error `NotAllowedError: play() failed because the user didn't interact with the document first` dan merusak kredibilitas situs luxury.
  - Momen sentuhan segel lilin adalah gestur alami yang sempurna untuk membuka kunci (`audioContext.resume()` dan `audio.play()`).
- **Alternatif yang Dipertimbangkan**:
  - *Autoplay Muted lalu Unmute saat Scroll*: Ditolak karena tamu belum tentu langsung scroll dan dapat membingungkan pengalaman pembukaan amplop.

---

## 4. Orkestrasi Overlay Layar Penuh & Scroll Locking

- **Keputusan**: `VirtualEnvelope` dirender sebagai *fixed fullscreen overlay* (`z-50`) dengan `document.body.style.overflow = 'hidden'`. Setelah urutan animasi 4 langkah selesai (retak segel, flap terbuka, surat meluncur, fade-out overlay), overlay di-unmount secara bersih melalui `AnimatePresence` (`motion/react`) dan scroll halaman utama dipulihkan.
- **Rasional**:
  - Menjamin tamu tidak dapat menggulir halaman utama di balik amplop sebelum amplop dibuka.
  - Unmounting via `AnimatePresence` memastikan elemen amplop tidak membebani memori DOM atau mengganggu *hit-testing* elemen halaman utama setelah terbuka.
- **Alternatif yang Dipertimbangkan**:
  - *CSS Display None / Opacity 0*: Ditolak karena elemen yang disembunyikan hanya dengan opacity tetap ada di accessibility tree dan dapat mengganggu interaksi layar pembaca.

---

## 5. Kontras Floating Vinyl Player: Ring Prada Permanen vs Dynamic IntersectionObserver

- **Keputusan**: Piringan vinyl 52px selalu diberi garis batas (*ring*) permanen Prada Emas `1px solid rgba(217, 190, 133, 0.35)` dan elevasi bayangan `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35)`.
- **Rasional**:
  - Memenuhi standar rasio kontras WCAG AA di atas seksi latar terang (Gading Keraton `#F6F1E7`) maupun seksi latar gelap (Malam Wulung `#15120F`).
  - Menghindari overhead performa komputasi scroll listener atau *IntersectionObserver* yang memicu repaint berulang saat menggulir halaman.
- **Alternatif yang Dipertimbangkan**:
  - *IntersectionObserver dengan class toggling*: Ditolak karena menambah kompleksitas state dan berpotensi mengalami keterlambatan (*lag*) visual saat scroll cepat.
  - *CSS mix-blend-mode: difference*: Ditolak karena menghasilkan pergeseran warna yang tidak dapat diprediksi dan merusak palet warna resmi Surakarta.

---

## 6. Next.js 15 App Router: Asynchronous `searchParams`

- **Keputusan**: Halaman `src/app/page.tsx` sebagai Server Component membaca parameter URL asinkron:
  ```typescript
  interface PageProps {
    searchParams: Promise<{ to?: string }>;
  }
  export default async function HomePage({ searchParams }: PageProps) {
    const { to } = await searchParams;
    const sanitizedGuestName = to ? sanitizeGuestName(to) : 'Tamu Undangan';
    ...
  }
  ```
- **Rasional**:
  - Next.js 15 App Router secara resmi menjadikan `searchParams` dan `params` sebagai objek `Promise` asinkron (breaking change dari Next.js 14).
  - Membaca secara asinkron di Server Component mencegah peringatan runtime dan menjamin sanitasi nama sebelum dikirim ke Client Components.
