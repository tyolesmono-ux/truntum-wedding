# Feature Specification: Seksi Linimasa Kisah Cinta & Galeri Sinematik (Fase 3B)

**Feature Branch**: `003-editorial-sections` (Sub-spesifikasi: `003b-editorial-story-gallery`)  
**Created**: 2026-09-19  
**Status**: Draft  
**Input**: User description: "Fase 3B: Seksi Linimasa Kisah Cinta (3.7) & Galeri Foto Sinematik + Lightbox Gesture (3.8) berdasarkan Roadmap Pengerjaan dan SSoT Desain"  

---

## Clarifications

### Session 2026-09-19

- Q: Bagaimana keterangan foto (caption) editorial disajikan saat tamu membuka modal Lightbox? → A: Keterangan foto ditampilkan di bagian bawah modal (Jost 14px, `--fg-on-dark`) dengan bar atas untuk nomor foto dan tombol tutup.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Menyelami Perjalanan Cinta Melalui Linimasa Sinematik (Priority: P1)

Sebagai tamu undangan yang ingin mengenal lebih dalam ketulusan dan perjalanan cinta kedua mempelai, saya ingin membaca babak-babak kisah cinta mereka yang tersaji secara elegan di atas garis waktu vertikal berlatar temaram Malam Wulung, di mana garis emas terisi perlahan saat saya menggulir layar, agar saya merasakan kehangatan romansa dan khidmatnya takdir yang mempertemukan mereka.

**Why this priority**: Linimasa kisah cinta (*Love Story*) merupakan jembatan emosional antara rincian acara formal dan selebrasi visual galeri. Seksi ini membangun narasi puitis yang menyentuh hati para tamu.

**Independent Test**: Dapat diuji secara mandiri dengan menggulir ke seksi Love Story dan memverifikasi tata letak *left-rail*, pengisian garis progres vertikal emas saat digulir, titik penanda (*nodes*) beraksen Prada Emas, serta tipografi tahun (*Bodoni Moda*) dan narasi (*Jost*) yang kontras tinggi di atas latar Malam Wulung (`#15120F`).

**Acceptance Scenarios**:

1. **Given** tamu menggulir melewati seksi Rangkaian Acara, **When** memasuki seksi Love Story, **Then** terjadi transisi visual tepi gradasi lembut menuju latar Malam Wulung (`#15120F`) dengan teks kontras tinggi (`#EFE6D6`).
2. **Given** tamu menggulir ke bawah sepanjang seksi Love Story, **When** pergerakan scroll terjadi, **Then** garis vertikal Prada Emas di sisi kiri terisi secara proporsional dari atas ke bawah mengikuti posisi pandang layar.
3. **Given** garis vertikal melewati titik babak cerita (*milestone node*), **When** titik penanda aktif, **Then** elemen babak cerita menampilkan tahun dan narasi puitis dengan animasi kemunculan halus (*reveal animation*) 500ms `easeOut`.
4. **Given** tamu mengakses melalui perangkat seluler (390px) maupun layar komputer lebar, **When** seksi Love Story dilihat, **Then** tata letak garis penanda tetap konsisten di sisi kiri (*left-aligned*) dengan teks narasi mengalir teratur di sisi kanan garis.

---

### User Story 2 - Menikmati Galeri Foto Sinematik Berformat Majalah Mode (Priority: P2)

Sebagai tamu undangan yang menghargai keindahan visual, saya ingin melihat kurasi potret kebersamaan kedua mempelai yang ditata dalam komposisi asimetris bergaya majalah editorial mode (*high-fashion editorial spread*) tanpa pembatas bingkai kaku, agar saya dapat menikmati dokumentasi visual yang megah, sinematik, dan artistik.

**Why this priority**: Galeri foto merupakan puncak daya tarik visual undangan digital. Tata letak majalah seni kontemporer mengangkat derajat estetika website di atas rata-rata undangan digital pasaran.

**Independent Test**: Dapat diuji secara mandiri dengan memeriksa susunan foto pada seksi Galeri: kombinasi foto lanskap (16:9) bentang penuh (*full-width*) dan foto potret (3:4) dua kolom tanpa celah tepi luar (*full-bleed edge-to-edge*), dengan rasio aspek terjaga tanpa distorsi atau pergeseran tata letak (*CLS = 0*).

**Acceptance Scenarios**:

1. **Given** tamu berada pada seksi Galeri Foto, **When** halaman dimuat, **Then** foto-foto tersaji dalam susunan kurasi asimetris berlatar Malam Wulung (`#15120F`) dengan placeholder warna Kertas Batik (`#E8DCC8`) sebelum gambar selesai dimuat.
2. **Given** foto dengan rasio lanskap 16:9, **When** ditampilkan di layar ponsel atau desktop, **Then** foto membentang memenuhi lebar bidang pandang (*full-width cinematic spread*).
3. **Given** pasangan foto berformat potret 3:4, **When** ditampilkan, **Then** foto tersusun berdampingan dalam dua kolom proporsional yang rapi tanpa margin luar.
4. **Given** tamu mengarahkan kursor atau menyentuh salah satu foto thumbnail, **When** interaksi terjadi, **Then** sistem memberikan indikasi visual santun bahwa foto dapat diketuk untuk diperbesar.

---

### User Story 3 - Menjelajahi Foto Secara Imersif Melalui Modal Lightbox Bergestur Sentuh (Priority: P3)

Sebagai pengguna ponsel cerdas yang sedang melihat galeri, saya ingin mengetuk salah satu foto untuk membukanya dalam tampilan layar penuh (*Lightbox*) dan dapat dengan mudah berpindah antar foto menggunakan usapan jari ke kiri/kanan (*swipe*), memperbesar detail (*pinch-to-zoom*), atau menutup kembali dengan usapan ke bawah (*swipe-to-dismiss*), agar pengalaman menikmati foto terasa alami, interaktif, dan setara dengan aplikasi galeri foto bawaan ponsel pintar.

**Why this priority**: Aksesibilitas interaksi sentuh (*touch gestures*) pada modal foto memberikan kenyamanan penjelajahan maksimal bagi 95%+ pengunjung seluler tanpa kebingungan mencari tombol kecil.

**Independent Test**: Menguji pengetukan thumbnail foto untuk membuka Lightbox, menguji usapan geser horizontal ke kiri dan kanan untuk berpindah foto, menguji usapan ke bawah untuk menutup modal, menguji tombol keyboard `Escape` dan panah kiri/kanan di komputer, serta memastikan pengguliran halaman latar (*Lenis smooth scroll*) terkunci selama modal terbuka.

**Acceptance Scenarios**:

1. **Given** tamu mengetuk salah satu thumbnail foto di galeri, **When** modal Lightbox terbuka, **Then** foto tampil di tengah layar berlatar belakang gelap transparan pekat, disertai bilah atas yang memuat indikator nomor foto (misal: "03 / 07") berfont tabular *Jost* dan tombol tutup minimalis, serta bilah bawah yang menyajikan teks keterangan foto (*caption*) editorial berfont *Jost* 14px (`--fg-on-dark`), dan pengguliran halaman belakang terkunci total.
2. **Given** modal Lightbox sedang terbuka di ponsel pintar, **When** tamu mengusap layar ke kiri (*swipe left*), **Then** modal berganti ke foto berikutnya; **When** tamu mengusap ke kanan (*swipe right*), **Then** modal berganti ke foto sebelumnya.
3. **Given** modal Lightbox sedang terbuka di ponsel pintar, **When** tamu mengusap layar ke arah bawah (*swipe down*), **Then** modal menutup secara mulus dan mengembalikan posisi pandang tamu ke galeri utama.
4. **Given** tamu menggunakan komputer desktop dengan keyboard, **When** menekan tombol `Escape`, **Then** modal Lightbox tertutup; **When** menekan tombol panah kiri atau kanan, **Then** foto berpindah sesuai arah panah.
5. **Given** modal Lightbox ditutup, **When** kembali ke halaman utama, **Then** kemampuan pengguliran inersia (*Lenis smooth scroll*) diaktifkan kembali tanpa lompatan posisi halaman.

---

### Edge Cases

- **Layar ponsel sangat ramping (< 360px)**: Komposisi foto dua kolom pada galeri tetap menjaga rasio aspek 3:4 tanpa pemotongan gambar yang merusak proporsi wajah subjek.
- **Pengunjung dengan preferensi gerak rendah (`prefers-reduced-motion`)**: Garis progres linimasa tampil terisi penuh secara statis dan animasi kemunculan teks ditiadakan; modal Lightbox bertransisi secara instan tanpa efek pembesaran skala.
- **Navigasi batas foto (awal dan akhir)**: Saat berada di foto pertama dan tamu mengusap ke kanan atau menekan panah kiri, modal memberikan pantulan resistansi halus (*rubber-band*) tanpa menimbulkan galat. Hal serupa berlaku pada foto terakhir saat mengusap ke kiri.
- **Perubahan orientasi perangkat (Portrait ke Landscape)**: Modal Lightbox yang sedang aktif menyesuaikan ukuran foto secara dinamis agar seluruh bidang gambar tetap berada di dalam batas pandang layar (*contain mode*).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistem HARUS mendefinisikan tipe data imutabel `LoveStoryMilestone` dan `GalleryPhoto` serta memperluas konfigurasi baca-saja `WEDDING_CONTENT_CONFIG` di `src/lib/config/wedding-content.ts`.
- **FR-002**: Seksi Love Story HARUS merender garis vertikal di sisi kiri (*left-rail*) yang terisi secara proporsional dari atas ke bawah mengikuti posisi pengguliran pengguna (*scroll-linked progress line*).
- **FR-003**: Setiap babak linimasa Love Story HARUS menampilkan penanda titik (*node*) beraksen Prada Emas (`#C2A05B`), tahun/babak berfont *Bodoni Moda*, dan teks narasi santun berbahasa Indonesia berfont *Jost*.
- **FR-004**: Seksi Galeri Foto HARUS merender tata letak grid asimetris bergaya majalah editorial mode yang memadukan foto lanskap (16:9 bentang penuh) dan foto potret (3:4 berpasangan) tanpa garis tepi luar (*full-bleed edge-to-edge*).
- **FR-005**: Seluruh foto galeri HARUS memiliki teks deskriptif (*alt text*), dimensi lebar dan tinggi yang pasti, serta placeholder warna Kertas Batik (`#E8DCC8`) untuk mencegah pergeseran tata letak (*Cumulative Layout Shift = 0*).
- **FR-006**: Mengetuk salah satu foto di galeri HARUS membuka modal Lightbox berlayar penuh dengan latar belakang Malam Wulung pekat (`rgba(21, 18, 15, 0.95)`).
- **FR-007**: Modal Lightbox HARUS mendukung navigasi foto sebelumnya dan berikutnya melalui gestur usap horizontal ponsel (*touch swipe*) dan tombol panah keyboard (`ArrowLeft`, `ArrowRight`).
- **FR-008**: Modal Lightbox HARUS mendukung penutupan melalui tombol tutup berlabel aksesibel, tombol `Escape`, dan gestur usap ke bawah (*swipe-to-dismiss*).
- **FR-009**: Modal Lightbox HARUS menampilkan bilah atas yang memuat nomor urut foto saat ini terhadap total foto berformat angka tabular (misal: "01 / 07") dan tombol tutup, serta bilah bawah yang menampilkan keterangan foto (*caption*) editorial secara anggun berfont *Jost* 14px (`--fg-on-dark`).
- **FR-010**: Sistem HARUS menghentikan pengguliran halaman latar belakang (*smooth scroll*) saat modal Lightbox aktif, dan mengaktifkannya kembali saat modal ditutup.
- **FR-011**: Transisi latar belakang dari seksi terang (Rangkaian Acara) menuju seksi gelap (Love Story dan Galeri) HARUS diterapkan melalui penataan kontainer CSS berlatar `#15120F` dengan tepi gradasi halus tanpa membebani thread utama browser (*zero JavaScript paint overhead*).

---

### Key Entities

- **LoveStoryMilestone**:
  - `id`: Pengenal unik babak kisah (string, misal: `'pertemuan-pertama'`).
  - `year`: Angka tahun peristiwa formal (string, misal: `'2021'`).
  - `period`: Keterangan waktu atau musim yang santun (string, misal: `'Musim Gugur 2021'`).
  - `title`: Judul babak perjalanan cinta (string, misal: `'Awal Jumpa di Balairung Ageng'`).
  - `story`: Narasi puitis bahasa Indonesia yang santun dan menghormati kesopanan (string, 150–300 karakter).
- **GalleryPhoto**:
  - `id`: Pengenal unik foto kurasi (string, misal: `'gallery-1'`).
  - `src`: Jalur aset gambar format WebP/AVIF bergradasi warna hangat (string).
  - `alt`: Teks deskripsi aksesibel untuk pembaca layar (string).
  - `width`: Lebar intrinsik gambar dalam piksel (number, misal: `1200`).
  - `height`: Tinggi intrinsik gambar dalam piksel (number, misal: `800` atau `1600`).
  - `aspectRatio`: Rasio format editorial (`'landscape'` 16:9 atau `'portrait'` 3:4).
  - `caption`: Keterangan foto editorial opsional (string).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pengunjung dapat membaca seluruh babak perjalanan cinta dari awal hingga akhir dengan alur pengguliran vertikal alami satu arah tanpa terjadi lonjakan tata letak (*Cumulative Layout Shift = 0*).
- **SC-002**: Seluruh foto galeri tampil dalam resolusi tajam dengan proporsi rasio aspek yang presisi tanpa distorsi pada semua rentang lebar layar (360px hingga layar desktop).
- **SC-003**: Pengunjung seluler dapat membuka modal Lightbox, berpindah foto dengan gestur usap jari (*swipe*), dan menutup modal dengan waktu respon interaksi di bawah 100 milidetik.
- **SC-004**: Pengguliran latar belakang terhenti 100% saat modal Lightbox aktif, mencegah hilangnya posisi pengguliran tamu saat modal ditutup.
- **SC-005**: Pengunjung dengan preferensi `prefers-reduced-motion` dapat mengakses seluruh konten linimasa dan galeri secara utuh dengan transisi instan tanpa efek animasi yang mengganggu.

---

## Assumptions

- Seluruh materi foto kurasi telah dioptimalkan dengan resolusi maksimal 1200px dan bobot berkas $\le 150\text{ KB}$ sesuai SSoT `DESIGN.md`.
- Data narasi kisah cinta dan urutan foto bersifat statis dan tersimpan pada konfigurasi baca-saja di sisi server.
- Gestur sentuh ponsel beroperasi secara konsisten pada peramban seluler modern (iOS Safari dan Android Chrome).
