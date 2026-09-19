# Research & Architecture Decisions: Seksi Halaman Utama & Narasi Editorial (Fase 3A)

**Feature**: `003-editorial-sections`  
**Date**: 2026-09-19  
**Status**: Completed  

---

## 1. Integrasi Smooth Scroll (Lenis Engine) di Next.js 15 & Mobile Touch

### Decision
Mengimplementasikan client component wrapper `<SmoothScrollProvider>` menggunakan `ReactLenis` dari pustaka `lenis/react` dengan konfigurasi:
```typescript
{
  lerp: 0.085,
  wheelMultiplier: 1,
  touchMultiplier: 1.6,
  syncTouch: false, // Wajib false untuk perangkat mobile
}
```
Pengguliran dinonaktifkan (`lenis.stop()`) ketika amplop pembuka virtual masih tertutup (`!isOpened`), dan diaktifkan kembali (`lenis.start()`) saat gerbang dibuka.

### Rationale
- **Performa 60–120 FPS Mobile**: Berdasarkan dokumentasi resmi Lenis (`context7: /darkroomengineering/lenis`), opsi `syncTouch: false` membiarkan event sentuh berjalan melalui momentum scroll native bawaan OS (iOS WebKit & Android Blink). Ini menjamin nol jank, hemat baterai, dan responsif sentuh tanpa latency JS.
- **Inersia Mewah di Desktop**: Untuk pengguna desktop dengan mouse wheel, `lerp: 0.085` menghadirkan sensasi inersia meluncur ala website majalah mode internasional (*Vogue/Kinfolk*).
- **Isolasi State Amplop**: Integrasi `lenis.stop()` saat amplop tertutup mencegah halaman bergeser di belakang amplop 3D.

### Alternatives Considered
- *Native CSS `scroll-behavior: smooth`*: Ditolak karena tidak mendukung kurva interpolasi (*lerp*) inersia di desktop dan terasa kaku.
- *`syncTouch: true` di semua perangkat*: Ditolak karena mengintersepsi event touch layar ponsel dengan JavaScript loop, berisiko menurunkan frame rate di bawah 60 FPS pada ponsel kelas menengah (melanggar Konstitusi Pasal IV).

---

## 2. Tipografi Kaligrafi Arab (Surat Ar-Rum: 21) & Subsetting Font

### Decision
Menggunakan tipografi web asli berbasis font Google **Amiri** dengan subsetting ketat Unicode Arabic (`U+0600-06FF, U+FE70-FEFF`) melalui `next/font/google`. Elemen HTML menggunakan `<p dir="rtl" lang="ar" className="font-arabic ...">`.

### Rationale
- **Ukuran Sangat Ringan**: Font Amiri yang di-subset hanya berukuran $\le 30\text{ KB}$ (jauh di bawah batas anggaran font 120 KB).
- **Aksesibilitas & Kualitas Render**: Teks Arab asli tetap tajam di layar retina resolusi berapapun, dapat dibaca oleh screen reader tunanetra (WCAG AA), dan dapat disalin oleh tamu jika ingin membaca doa.
- **Zero Layout Shift**: Menggunakan `display: 'swap'` dengan fallback serif metrics agar tidak terjadi lonjakan tata letak (*CLS = 0*).

### Alternatives Considered
- *Vektor SVG Kaligrafi Statis*: Ditolak karena ukuran berkas SVG kaligrafi khat Thuluth yang rumit dapat mencapai 40–70 KB dan tidak ramah aksesibilitas screen reader.
- *Gambar PNG/WebP Kaligrafi*: Ditolak karena pecah pada layar High-DPI dan membebani transfer data seluler.

---

## 3. Tata Letak Profil Mempelai & Bentuk Bingkai Foto Surakarta

### Decision
Foto potret mempelai dibingkai dengan kubah khas keraton (*arch/ogee*) menggunakan CSS border radius:
```css
border-radius: 50% 50% 4px 4px / 32% 32% 4px 4px;
```
Tata letak kartu profil responsif:
- Mobile (`<768px`): Stack vertikal satu kolom dengan ornamen pemisah Truntum dan ampersand (*&*) Bodoni Moda di tengahnya.
- Desktop (`≥768px`): 2 kolom berdampingan (*side-by-side editorial spread*) terpusat pada kontainer maksimal 720px.

### Rationale
- **Estetika Budaya Surakarta**: Bentuk kubah ogee mengingatkan pada lengkung pintu gerbang Sasana Handrawina Keraton Surakarta Hadiningrat.
- **Kenyamanan Baca Mobile**: Stack vertikal memberi ruang nafas lapang di layar kecil (390px) sehingga nama orang tua dan trah keluarga terbaca terhormat dan tidak berdesakan.

### Alternatives Considered
- *Bingkai Oval Penuh (`border-radius: 50%`)*: Ditolak karena terasa seperti avatar generik media sosial, bukan potret formal keraton.
- *Grid 2 Kolom di Layar Mobile*: Ditolak karena membuat foto dan teks silsilah terhimpit pada layar selebar 390px.

---

## 4. Penghitung Waktu Mundur (Countdown) & Stabilitas SSR Next.js 15

### Decision
Mengembangkan hook reaktif `useCountdown(targetIsoDate)` dengan pelindung hidrasi (*client-mounted guard*) dan angka tabular (`font-variant-numeric: tabular-nums`). Timer dibingkai oleh siluet garis Gunungan Prada Emas 1px (`#C2A05B`).

### Rationale
- **Pencegahan Hydration Mismatch**: Pada Next.js 15 App Router, kalkulasi `new Date()` di server akan berbeda beberapa milidetik dengan di klien. Dengan mounted guard, server merender placeholder statis yang stabil, kemudian klien mengaktifkan interval 1 detik secara sinkron.
- **Nol Goyangan Teks**: Angka tabular memastikan lebar digit angka 0–9 sama persis sehingga pemisah titik dua dan label tidak bergeser setiap pergantian detik.
- **Penanganan Status Kadaluarsa**: Saat waktu target terlewati, timer beralih menampilkan pesan formal *"Acara pernikahan sedang / telah berlangsung"*.

### Alternatives Considered
- *Library external `react-countdown`*: Ditolak sesuai `/ponytail full` (YAGNI). Logika waktu mundur hanya membutuhkan ~30 baris kode native JavaScript (`Math.floor` selisih milidetik), menghemat ukuran bundle JS.

---

## 5. Integrasi Jadwal Acara, Kalender (.ics & Google Calendar), dan Peta Venue

### Decision
Menyediakan dua tombol aksi elegan di setiap kartu sesi acara (Akad & Resepsi):
1. **Tambah ke kalender**:
   - **Google Calendar**: Tautan URL langsung membuka tab baru:
     `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&details=...&location=...`
   - **Apple Calendar / Outlook / iCal**: Mengunduh berkas `.ics` (RFC 5545) yang dibuat langsung di sisi klien melalui Data URI Blob (`data:text/calendar;charset=utf8,...`).
2. **Buka peta venue**:
   - Tautan langsung ke Google Maps (`https://www.google.com/maps/search/?api=1&query=...`) dan opsi Waze (`https://waze.com/ul?q=...`).

### Rationale
- **Nol Dependensi Pihak Ketiga**: Format `.ics` di-generate secara murni menggunakan string template standar iCalendar RFC 5545 tanpa perlu menginstal pustaka `ics` (hemat 15 KB bundle).
- **Kenyamanan Tamu**: Tamu Android dapat langsung masuk ke Google Calendar, sedangkan tamu iPhone dapat mengimpor berkas `.ics` ke Apple Calendar dengan satu ketukan.

### Alternatives Considered
- *API Endpoint Download `.ics`*: Ditolak karena memerlukan round-trip server jaringan. Client-side Blob download bersifat instan, offline-capable, dan zero-latency.
