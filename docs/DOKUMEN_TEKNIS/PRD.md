# PRD & Technical Design Specification: Luxury & Modern Bespoke Wedding Invitation

- **Project Name**: Bespoke Luxury Digital Wedding Invitation
- **Date**: 2026-09-19
- **Aesthetic Direction**: Editorial High-Fashion dengan fondasi warna & ornamen Surakarta (SSoT: [`DESIGN.md`](./DESIGN.md))
- **Primary Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS, Motion (`motion/react`), Lenis, Supabase
- **Technical Documentation**: [`DESIGN.md`](./DESIGN.md) | [`TECH_STACK.md`](./TECH_STACK.md) | [`ARCHITECTURE.md`](./ARCHITECTURE.md) | [`DATABASE_ERD.md`](./DATABASE_ERD.md) | [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) | [`CODING_STANDARD.md`](./CODING_STANDARD.md) | [`SECURITY.md`](./SECURITY.md)

---

## 1. Product Overview & Objectives

### 1.1 Executive Summary
Proyek ini bertujuan membangun website undangan pernikahan digital eksklusif (*bespoke*) untuk satu pasangan pengantin dengan standar desain *award-winning* bergaya majalah editorial mode (*high-fashion*). Fokus utama diletakkan pada:
1. **Sensasi Kemewahan Fisik ke Digital**: Animasi pembuka virtual amplop 3D dengan segel lilin (*wax seal*) monogram.
2. **Kenyamanan Audio Otomatis**: Integrasi musik latar berputar lembut (*audio fade-in*) setelah interaksi pertama pengguna.
3. **Sentuhan Sakral & Doa**: Bagian khusus ayat suci Al-Qur'an (Ar-Rum: 21) dan doa pernikahan sunnah dengan kaligrafi estetik.
4. **Keamanan Finansial Ekstrem (Anti-Phishing & Anti-XSS)**: Perlindungan total terhadap informasi nomor rekening dan QRIS pengantin, sanitasi ketat buku tamu, dan pembatasan spam.
5. **Performa Seluler Tinggi**: Berjalan mulus di 60 FPS pada koneksi seluler tanpa mengorbankan kualitas visual.

### 1.2 Target Audience & Platform Constraints
- **Target Pengunjung**: 95%+ tamu mengakses via smartphone (iOS Safari & Android Chrome) melalui tautan WhatsApp/Instagram.
- **Batasan Teknis**: 
  - Kebijakan browser seluler melarang audio *autoplay* tanpa interaksi pengguna (*user gesture*).
  - Variasi kecepatan internet seluler tamu mengharuskan *initial bundle* ringan dan optimasi kompresi media agresif.

---

## 2. User Journey & Core Features

### 2.1 User Journey Flow
```
[Tautan WhatsApp dengan Parameter ?to=Nama+Tamu]
                     │
                     ▼
  [Pratinjau Dynamic OpenGraph Card dengan Nama Tamu]
                     │
                     ▼
 [Layar Gerbang: Virtual Envelope 3D + Monogram Wax Seal]
                     │ (Tamu Klik Wax Seal)
                     ▼
   [Animasi Lipatan Amplop Terbuka + Surat Terangkat]
                     │ (Pemicu Audio Context: Musik Fade-In)
                     ▼
[Transisi Mulus ke Halaman Utama (Lenis Smooth Scroll)]
                     │
 ┌───────────────────┴───────────────────┐
 │                                       │
 ▼                                       ▼
[Hero Section Editorial]        [Floating Vinyl Audio Player]
 │                                       │ (Toggle Mute/Play)
 ▼                                       ▼
[Section Ayat Suci & Doa Islami]
 │
 ▼
[Profil Mempelai Pria & Wanita]
 │
 ▼
[Countdown Timer Menuju Hari H]
 │
 ▼
[Rangkaian Acara (Akad & Resepsi) + Add to Calendar & Google Maps]
 │
 ▼
[Love Story Timeline (Scroll-Linked Animation)]
 │
 ▼
[Galeri Foto Sinematik & Lightbox Gesture]
 │
 ▼
[Digital Gift: Rekening Bank (Copy) & QRIS (Anti-Tampering)]
 │
 ▼
[RSVP & Realtime Guestbook (Sanitized Input + Confetti)]
```

### 2.2 Rincian Fitur Utama

#### A. Opening Gate (Virtual Envelope with Wax Seal)
- Amplop digital bertekstur kertas mewah dengan bayangan realistis.
- Teks personalisasi di atas amplop: *"Kepada Bapak/Ibu/Saudara [Nama Tamu]"* dan tombol aksi *"Buka undangan"*.
- Monogram lilin interaktif: Menampilkan inisial kedua mempelai dengan gradasi cinde & prada.
- Animasi klik: Segel retak halus, flap amplop berotasi naik, surat undangan meluncur keluar, diakhiri transisi *fade-out* amplop untuk mengekspos halaman utama.

#### B. Floating Vinyl Audio Player
- Tombol mengambang elegan di pojok kanan bawah berbentuk piringan vinyl dengan label monogram.
- Berputar kontinu (360°) saat audio bermain; berhenti saat di-pause.
- Dilengkapi mekanisme *linear audio fade-in* (0 ke 0.8 dalam 2.5 detik) agar transisi pendengaran nyaman.

#### C. Section Ayat Suci & Doa Islami
- Menampilkan Surat Ar-Rum ayat 21 dengan teks kaligrafi Arab berkualitas tinggi (Amiri font subset) dan terjemahan bahasa Indonesia.
- Menampilkan doa berkah pernikahan: *"Barakallahu laka wa baraka 'alaika wa jama'a bainakuma fii khair"*.
- Menggunakan animasi kemunculan bertingkat (*staggered reveal* yang dikhususkan pada section sakral ini).

#### D. Rangkaian Jadwal Acara & Integrasi Kalender
- Informasi lengkap waktu, zona waktu, dan lokasi untuk Akad Nikah dan Resepsi.
- Tombol integrasi kalender satu-klik (*Google Calendar*, *Apple Calendar*, file `.ics`).
- Tombol *Direct Navigation* membuka aplikasi Google Maps/Waze langsung ke titik koordinat venue.

#### E. Galeri Foto & Kisah Cinta (Storytelling)
- Galeri foto format majalah dengan *masonry layout* (berlatar Malam Wulung gelap sinematik).
- Fitur *Lightbox modal* dengan dukungan *swipe gesture* dan *pinch-to-zoom*.
- Timeline kisah cinta dengan progres garis vertikal yang terisi saat layar digulir.

#### F. Rekening Digital & QRIS (Fitur Terproteksi)
- Menampilkan rekening bank resmi pengantin dengan tombol *one-click copy to clipboard* disertai toast konfirmasi *"Nomor rekening tersalin"*.
- Modal tampilan QRIS resolusi tajam dengan latar putih murni `#FFFFFF` (bukan gading) untuk menjamin pemindaian kamera.

#### G. RSVP & Live Guestbook Wall
- Form konfirmasi kehadiran: Nama Tamu, Status (Hadir / Berhalangan via pill selector), Jumlah Tamu (1–5 orang), Doa Restu (tanpa link/URL).
- Efek perayaan konfeti instan (`canvas-confetti`) setelah submit sukses dengan palet warna resmi SSoT (`#C2A05B`, `#8C2F27`, `#F6F1E7`, `#6B4423`).
- Daftar ucapan tamu tampil secara *real-time* dipisahkan oleh garis pembatas halus 1px `--line` (bukan kartu bertumpuk) tanpa perlu memuat ulang halaman.

---

## 3. Keamanan Tingkat Tinggi (Security Hardening)

Mengingat terdapat data sensitif berupa rekening bank dan QRIS, sistem menerapkan prinsip **Zero Trust on User Input**:

### 3.1 Perlindungan Terhadap Phishing & Manipulasi Rekening (Anti-Tampering)
- **Hardened Server Constants**: Data rekening (Nama Bank, Nomor Rekening, Atas Nama, URL Gambar QRIS) **TIDAK PERNAH** disimpan pada tabel publik yang dapat dimutasi via API.
- Seluruh data rekening dikunci di sisi server (*Server Environment/Read-Only Config*), sehingga mustahil diinjeksi atau ditimpa oleh pihak luar.

### 3.2 Pencegahan Stored XSS & HTML Injection
- **Pembersihan Input Agresif**: Seluruh input teks nama dan doa restu diproses oleh `DOMPurify` / sanitizer di sisi server sebelum masuk database.
- **Pembersihan Tag HTML**: Semua tag HTML (`<script>`, `<iframe>`, `<a>`, `<img />`, dll) dan sintaks Markdown dihapus total.
- **Link/URL Blocker**: Sistem memvalidasi dan menolak setiap pesan yang mengandung pola link/URL untuk mencegah tautan phishing atau penipuan.
- **Safe React Rendering**: Ucapan di-render murni sebagai teks (`<p>{item.message}</p>`). Dilarang keras menggunakan `dangerouslySetInnerHTML`.

### 3.3 Content Security Policy (CSP) & Header Keamanan
Dikonfigurasi pada middleware Next.js:
```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self' https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
];
```

### 3.4 Proteksi Spam & Bot (Rate Limiting)
- Formulir RSVP diproteksi dengan verifikasi bot tak kasat mata (**Cloudflare Turnstile**).
- Pembatasan laju (*rate limiting*): Maksimum 3 kiriman form per IP per 10 menit.
- Skema validasi ketat menggunakan **Zod**: Batas maksimal panjang pesan 500 karakter, panjang nama 60 karakter, pax 1–5.

---

## 4. Arsitektur Teknis & Komponen

### 4.1 Tech Stack
| Lapisan | Teknologi | Peran |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, TypeScript) | SSR, Server Actions, Dynamic OG |
| **Styling** | Tailwind CSS | Layout responsif editorial, utilitas gaya |
| **Animasi UI** | Motion (`motion/react`) | Transisi amplop 3D, gestur, stagger reveal |
| **Scroll Momentum** | Lenis | Smooth scrolling halus ala editorial luxury |
| **Database & Realtime** | Supabase (PostgreSQL) | Penyimpanan RSVP & Live WebSocket ucapan |
| **Validasi & Sanitasi** | Zod + DOMPurify | Validasi skema dan pembersihan input XSS |
| **Dynamic OpenGraph** | `next/og` (ImageResponse / Satori) | Generator kartu gambar preview WA dinamis |
| **Audio Engine** | HTML5 Audio + Web Audio API | Kontrol playback & volume ramp fade-in |
| **Mikro-Efek** | `canvas-confetti` | Efek selebrasi saat RSVP terkirim |

### 4.2 Struktur Direktori Proyek
```
/src
├── app/
│   ├── api/
│   │   └── og/
│   │       └── route.tsx          # Dynamic OG Image generator (?to=Nama)
│   ├── layout.tsx                 # Root layout, fonts, meta default
│   ├── page.tsx                   # Halaman utama undangan
│   └── globals.css                # Style global & konfigurasi font
├── components/
│   ├── audio/
│   │   ├── AudioController.tsx    # Audio context & state global
│   │   └── FloatingVinyl.tsx      # Komponen tombol piringan berputar
│   ├── opening/
│   │   ├── OpeningGate.tsx        # Container gerbang amplop
│   │   ├── VirtualEnvelope.tsx    # Amplop 3D bertekstur
│   │   ├── WaxSeal.tsx            # Segel lilin monogram interaktif
│   │   └── InvitationLetter.tsx   # Surat yang meluncur keluar
│   ├── sections/
│   │   ├── HeroSection.tsx        # Judul editorial & cover sinematik
│   │   ├── IslamicQuotes.tsx      # Ar-Rum 21 & Doa Pernikahan
│   │   ├── CoupleProfile.tsx      # Profil mempelai pria & wanita
│   │   ├── CountdownSection.tsx   # Hitung mundur hari H
│   │   ├── EventDetails.tsx       # Akad, Resepsi, Kalender & Maps
│   │   ├── LoveStoryTimeline.tsx  # Timeline perjalanan cinta
│   │   ├── GalleryMasonry.tsx     # Galeri foto editorial & Lightbox
│   │   ├── DigitalGift.tsx        # Rekening bank & QRIS (Read-only)
│   │   └── RSVPAndWishes.tsx      # Form RSVP & Live Guestbook
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Tooltip.tsx
├── lib/
│   ├── config/
│   │   └── wedding-data.ts        # Server constant (Jadwal, Rekening Bank, Foto)
│   ├── supabase/
│   │   ├── client.ts              # Supabase browser client
│   │   └── server.ts              # Supabase server client
│   ├── security/
│   │   ├── sanitize.ts            # Logika pembersihan XSS & penolakan link
│   │   └── rate-limiter.ts        # In-memory / cookie-based rate limiter
│   └── validations/
│       └── rsvp-schema.ts         # Zod validation schema
└── types/
    └── index.ts                   # Definisi TypeScript type/interface
```

---

## 5. Skema Data & Alur API

### 5.1 Skema Database PostgreSQL (Supabase)
```sql
-- Buat Enum Status Kehadiran
CREATE TYPE attendance_enum AS ENUM ('attending', 'declined');

-- Tabel RSVP & Doa Restu
CREATE TABLE public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name VARCHAR(60) NOT NULL,
  attendance_status attendance_enum NOT NULL,
  pax_count SMALLINT NOT NULL DEFAULT 1 CHECK (pax_count BETWEEN 1 AND 5),
  message VARCHAR(500) NOT NULL,
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing
CREATE INDEX idx_rsvps_created_at ON public.rsvps (created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Policy 1: Publik hanya dapat membaca nama, kehadiran, pesan, dan waktu
CREATE POLICY "Public can view sanitized wishes"
  ON public.rsvps
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 2: Publik hanya dapat menambahkan data baru
CREATE POLICY "Public can submit RSVP"
  ON public.rsvps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 3: Update & Delete diblokir total untuk publik (Hanya Service Role/Admin)
CREATE POLICY "Only admin can modify rsvps"
  ON public.rsvps
  FOR ALL
  TO service_role
  USING (true);
```

### 5.2 Server Action (`submitRSVP`)
1. Menerima payload `{ guest_name, attendance_status, pax_count, message, turnstile_token }`.
2. Validasi Cloudflare Turnstile token via endpoint Cloudflare API.
3. Validasi skema Zod.
4. Lakukan sanitasi: Tolak pengiriman jika `message` terdeteksi mengandung format `http://`, `https://`, atau `www.`.
5. Insert ke database Supabase via service role / authenticated client.
6. Return status sukses ke client untuk memicu konfeti.

---

## 6. Persyaratan Non-Fungsional & Performa

1. **Initial Bundle Size**: Target JavaScript awal $\le 90$ KB (gzipped).
2. **Kinerja Frame Rate**: Minimum 55–60 FPS selama transisi amplop dan scrolling pada iPhone 11 / Galaxy A52 atau yang lebih tinggi.
3. **Format & Optimasi Media**:
   - Gambar wajib berformat `.webp` / `.avif` dengan lebar maksimal 1200px dan target ukuran $\le 150$ KB.
   - Audio berformat `.mp3` 128kbps stereo dengan durasi yang pas (target ukuran $\le 3$ MB).
4. **Pencegahan Distorsi Tipografi**: Font Arab menggunakan *subsetting* khusus agar tidak mendownload glyph yang tidak terpakai.

---

## 7. Rencana Pengujian & Validasi

### 7.1 Automated & Security Testing
- **XSS Attack Simulation**: Menguji submit pesan dengan payload `<script>`, `<img src=x onerror=alert(1)>`, dan tautan phishing. Seluruh payload harus ditolak atau distrip tuntas.
- **Schema Validation Testing**: Memastikan `pax_count` > 5 atau < 1 dan string kosong ditolak dengan pesan error yang jelas.
- **Rate Limit Testing**: Memastikan pengiriman form berulang secara agresif dalam kurva waktu sempit terblokir oleh mekanisme rate limiter.

### 7.2 Manual Cross-Device & Audio Testing
- **Autoplay Compliance**: Memastikan audio tidak error (*uncaught promise*) sebelum amplop diklik pada iOS Safari Low Power Mode.
- **Smooth Gestures**: Memastikan transisi amplop dan gesture lightbox berjalan natural di layar sentuh Android dan iOS.
- **WhatsApp Link Preview**: Memverifikasi parameter `?to=Nama+Tamu` menghasilkan thumbnail OpenGraph yang proporsional dan teks terbaca jelas di berbagai aplikasi chat.
