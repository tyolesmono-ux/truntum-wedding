# Technical Stack Specification (TECH_STACK.md)
## Bespoke Luxury Digital Wedding Invitation

- **Version**: 1.0.0
- **Status**: Approved / Ready for Implementation
- **Author**: Antigravity Technical Architecture Team
- **Related Spec**: [`PRD.md`](./PRD.md)
- **Design System**: [`DESIGN.md`](./DESIGN.md)

---

## 1. Overview & Architectural Philosophy

Aplikasi undangan pernikahan digital eksklusif (*bespoke luxury*) ini dirancang dengan standar kualitas desain editorial majalah mode tinggi (*high-fashion editorial*, terinspirasi oleh estetika *Kinfolk* dan *Vogue*) yang dipadukan dengan standar rekayasa perangkat lunak modern.

Tiga pilar utama dalam pemilihan *tech stack* ini adalah:
1. **Sensasi Estetika & Interaktivitas Halus (60 FPS)**: Gerakan fluida, transisi 3D amplop virtual, segel lilin monogram, dan pengguliran inersia (*inertial smooth scrolling*).
2. **Keamanan Finansial & Sanitasi Zero-Trust**: Proteksi mutlak atas nomor rekening, gambar QRIS, dan data buku tamu dari ancaman *tampering*, *stored XSS*, bot spam, dan serangan injeksi.
3. **Performa Seluler Ekstrem (Mobile-First)**: Ukuran bundel awal JavaScript sangat ramping ($\le 90$ KB gzipped), optimasi aset media agresif (WebP/AVIF, audio MP3 terkompresi), dan kepatuhan terhadap kebijakan *browser autoplay*.

---

## 2. Comprehensive Tech Stack Breakdown

### 2.1 Core Framework & Language Layer

| Komponen | Teknologi | Versi Target | Justifikasi Teknis |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | `^15.0.0` (React 19) | Mendukung React Server Components (RSC) untuk meminimalkan client JavaScript, Server Actions untuk mutasi data aman tanpa mengekspos endpoint API publik, serta Edge Runtime untuk dynamic OpenGraph image generation. |
| **Language** | **TypeScript** | `^5.5.0` | Pengetikan statis ketat (*strict mode*), eliminasi bug runtime, autocompletion skema Zod, dan integrasi mulus dengan definisi tipe Supabase. |
| **Runtime Engine** | **Node.js LTS / Edge** | Node `^20.x` / Vercel Edge | Node.js untuk Server Actions & SSR; Edge Runtime untuk `@vercel/og` yang berlatensi rendah di CDN global. |
| **Package Manager** | **pnpm** (atau `npm`) | `^9.x` | Resolusi dependensi cepat, hemat ruang disk dengan *content-addressable store*, dan *lockfile* deterministik. |

---

### 2.2 Styling, Typography & Design System

| Komponen | Teknologi | Versi Target | Justifikasi Teknis |
| :--- | :--- | :--- | :--- |
| **Utility CSS** | **Tailwind CSS** | `^3.4.0` | Menghasilkan CSS minimalis tanpa *dead code*, dukungan utilitas grid editorial, responsive design fluid (`dvh`, clamp), dan kustomisasi variabel CSS untuk palet warna mewah. |
| **CSS Post-processor** | **PostCSS & Autoprefixer** | Standar Next.js | Memastikan kompatibilitas vendor prefix untuk animasi 3D CSS pada Safari iOS dan Android Chrome. |
| **Editorial Typography** | **next/font/google** | Next.js built-in | Mengeliminasi *Layout Shift* (CLS 0) melalui font self-hosting otomatis. Spesifikasi lengkap: [`docs/DESIGN.md`](./DESIGN.md). |
| **Primary Serif** | *Bodoni Moda* | Google Fonts (400, italic 400) | Didone bergaris tebal-tipis ekstrem ala sampul majalah editorial mode (*high-fashion*), selaras dengan ketajaman ukiran Surakarta. |
| **Body & UI Sans** | *Jost* | Google Fonts (300, 400, 500) | Tipografi geometris turunan Futura yang beresonansi dengan simetri motif kawung dan keterbacaan tinggi di layar seluler. |
| **Arabic Calligraphy** | *Amiri* (subset) | Google Fonts (400) | Render teks Arab Al-Qur'an (Surat Ar-Rum 21) presisi tinggi, menggunakan *glyph subsetting* khusus agar ukuran font $\le 30$ KB. |

#### Design Tokens & Color Palette (Surakarta Editorial)
Palet warna mengacu pada filosofi batik sogan Solo dan dodot keraton sebagaimana dirinci dalam [`docs/DESIGN.md`](./DESIGN.md):
```css
:root {
  /* Surfaces */
  --bg:            #F6F1E7;          /* Gading Keraton / Latar Utama */
  --surface:       #FCFAF5;          /* Melati / Kartu, Modal, Surat */
  --surface-alt:   #E8DCC8;          /* Kertas Batik / Permukaan Amplop */
  --bg-dark:       #15120F;          /* Malam Wulung / Latar Gelap & Galeri */
  --surface-dark:  #221D18;          /* Permukaan Malam */

  /* Typography */
  --fg:            #231F1B;          /* Wulung / Heading & Teks Utama */
  --fg-body:       #4A3E33;          /* Teks Body Halus */
  --fg-muted:      #8A7862;          /* Teks Muted */
  --fg-on-dark:    #EFE6D6;          /* Teks Gading di Latar Gelap */

  /* Brand & Accents */
  --brand:         #6B4423;          /* Sogan Tua / Brand, Tombol Utama */
  --brand-soft:    #B07D4A;          /* Sogan Muda / Garis Sekunder */
  --gold:          #C2A05B;          /* Prada Emas / Ornamen, Wax Seal */
  --gold-light:    #D9BE85;          /* Prada Terang / Label di Latar Gelap */
  --accent:        #8C2F27;          /* Cinde / Lilin Segel, Error, Konfeti */
  --success:       #7E8C74;          /* Gadung Mlati / Status Sukses */

  /* Dividers & Borders */
  --line:          #E0D3BC;          /* Border Lembut */
  --line-strong:   #C9B896;          /* Border Tegas & Garis Truntum */
}
```

---

### 2.3 Motion, Physics & Smooth Scrolling

| Komponen | Teknologi | Versi Target | Justifikasi Teknis |
| :--- | :--- | :--- | :--- |
| **Motion Engine** | **Motion (`motion/react`)** | `^11.11.0` | Standar industri animasi React (suksesor Framer Motion). Menyediakan *hardware-accelerated GPU transforms*, spring physics, gesture handling (*drag/swipe/pinch*), dan transisi *unmount/exit*. |
| **Scroll Momentum** | **Lenis (`lenis/react`)** | `^1.1.18` | Paket terpadu resmi dari Darkroom Engineering (`lenis/react`). Menghadirkan *smooth scrolling* inersia ala website luxury Awwwards via `<ReactLenis>` tanpa merusak fungsionalitas accessibility native. |
| **Timeline Triggers** | **Motion `useScroll` + `useTransform`** | Built-in Motion | Mengikat progres garis waktu *Love Story* dan rotasi piringan audio dengan posisi scroll jendela secara reaktif. |
| **Particle Effects** | **`canvas-confetti`** | `^1.9.3` | Efek semburan konfeti mewah berkinerja tinggi berbasis HTML5 Canvas untuk selebrasi submit RSVP tanpa lag di CPU seluler. |

---

### 2.4 Audio Architecture Layer

| Komponen | Teknologi | Detail Implementasi |
| :--- | :--- | :--- |
| **Playback Core** | **HTML5 `<audio>` + Web Audio API** | Integrasi `AudioContext` dengan `GainNode` untuk pengaturan ramp volume presisi. |
| **Fade-in Controller** | Custom Web Audio Ramp | Transisi linier volume dari `0.0` ke `0.8` dalam rentang waktu $2.5$ detik saat segel lilin amplop diklik. |
| **Autoplay Compliance** | Interactive User Gesture | Audio tidak akan pernah diputar sebelum pengguna menyentuh segel lilin (*wax seal*), mematuhi kebijakan anti-autoplay iOS Safari & Chrome Android. |
| **Floating Vinyl** | Pure CSS + Motion | Komponen mengambang dengan rotasi continuous 360° yang sinkron dengan status `isPlaying`. Menggunakan CSS `animation-play-state: running | paused` untuk menghemat daya baterai. |

---

### 2.5 Database & Realtime WebSocket Layer

| Komponen | Teknologi | Versi / Layanan | Justifikasi Teknis |
| :--- | :--- | :--- | :--- |
| **Database** | **Supabase (PostgreSQL 15+)** | Managed Cloud | Database relasional ACID terpercaya. Mendukung Row Level Security (RLS) deklaratif di level engine database. |
| **Realtime Engine** | **Supabase Realtime (WebSockets)** | `@supabase/supabase-js ^2.45.0` | Mengalirkan ucapan baru (*guestbook wall*) secara instan ke seluruh layar tamu yang aktif via Change Data Capture (CDC) PostgreSQL tanpa polling HTTP berulang. |
| **Connection Pooling** | Supabase Transaction Pooler | Supavisor (Port 6543) | Menangani lonjakan koneksi bersamaan dari ratusan tamu tanpa menghabiskan connection limit PostgreSQL. |

---

### 2.6 Security, Validation & Anti-Abuse Layer

| Komponen | Teknologi | Versi Target | Peran & Justifikasi |
| :--- | :--- | :--- | :--- |
| **Schema Validation** | **Zod** | `^3.23.0` | Validasi tipe runtime yang ketat di sisi client dan server: batas panjang nama, sanitasi pesan, validasi nilai pax, enum status kehadiran. |
| **XSS Sanitization** | **DOMPurify (`isomorphic-dompurify`)** | `^2.16.0` | Pembersihan menyeluruh dari setiap karakter berpotensi injeksi HTML (`<script>`, `<iframe>`, `onerror=`), membersihkan Markdown berbahaya, dan menolak tautan link phishing. |
| **Bot Detection** | **Cloudflare Turnstile** | Turnstile Client + Server API | Pengganti Google reCAPTCHA yang ramah privasi, tidak mengganggu tamu dengan puzzle gambar, dan sangat efektif menangkal spam bot otomatis. |
| **Rate Limiter** | Token Bucket / IP Hash Sliding Window | Custom In-Memory / Edge KV | Membatasi submit formulir maksimal 3 kali per IP per 10 menit untuk mencegah spam flooding. |
| **Security Headers** | Next.js Middleware | Standar HTTP RFC | Penerapan ketat Content Security Policy (CSP), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, dan `Permissions-Policy`. |
| **Hardened Constants** | Server-Only TypeScript Module | `lib/config/wedding-data.ts` | Nomor rekening dan URL QRIS diisolasi dalam modul server yang *immutable*, mencegah serangan *database tampering* atau mutasi API ilegal. |

---

### 2.7 Dynamic Social Preview (OpenGraph Engine)

| Komponen | Teknologi | Justifikasi Teknis |
| :--- | :--- | :--- |
| **OG Image Generator** | **`next/og` (Built-in ImageResponse)** | Modul bawaan Next.js App Router (berbasis Satori + Resvg). Merender kartu pratinjau tautan WhatsApp / Instagram secara dinamis berbasis JSX/HTML dan CSS flexbox. Mendukung injeksi nama tamu: `?to=Bapak+Budi+Sekeluarga` menghasilkan gambar 1200x630 bertuliskan nama tamu bersangkutan dalam hitungan milidetik di tepi jaringan (*edge*). |

---

## 3. Package Dependencies Specification

Berikut adalah daftar dependensi target untuk file `package.json`:

```json
{
  "name": "luxury-wedding-invitation",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.1",
    "@supabase/supabase-js": "^2.45.4",
    "canvas-confetti": "^1.9.3",
    "clsx": "^2.1.1",
    "isomorphic-dompurify": "^2.16.0",
    "lenis": "^1.1.14",
    "lucide-react": "^0.446.0",
    "motion": "^11.11.7",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.5.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.9.0",
    "@types/node": "^20.16.11",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.3"
  }
}
```

---

## 4. Environment Variables Matrix

Tabel variabel lingkungan (*environment variables*) yang dibutuhkan oleh sistem:

| Variabel | Lingkungan | Wajib? | Deskripsi & Contoh |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Ya | URL instance Supabase (misal: `https://xyzproject.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Ya | Kunci API anonim Supabase yang dilindungi RLS untuk client browser. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Ya | Kunci rahasia privilege tinggi untuk Server Action insert (Bypass RLS terkontrol). |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Client & Server | Ya | Site Key Cloudflare Turnstile untuk widget frontend. |
| `TURNSTILE_SECRET_KEY` | Server Only | Ya | Secret Key Cloudflare Turnstile untuk verifikasi server-to-server. |
| `NEXT_PUBLIC_SITE_URL` | Client & Server | Ya | Domain kanonikal undangan (misal: `https://theweddingof-anandabagus.com`). |
| `WEDDING_ADMIN_SECRET` | Server Only | Opsional | Kunci verifikasi internal untuk penghapusan komentar spam oleh panitia. |

> [!CAUTION]
> Variabel bertanda **Server Only** DILARANG KERAS menggunakan awalan `NEXT_PUBLIC_` untuk mencegah kebocoran kredensial ke bundel JavaScript browser.

---

## 5. Browser & Device Compatibility Matrix

Aplikasi diuji dan dioptimalkan secara ketat pada platform berikut:

| Platform / Browser | Engine | Kategori | Fitur Kritis yang Didukung |
| :--- | :--- | :--- | :--- |
| **iOS Safari (iOS 15+)** | WebKit | Utama (60%+) | Gestur sentuh, Web Audio gesture unlock, 3D CSS envelope, Dynamic Viewport Height (`dvh`). |
| **Android Chrome (v90+)** | Blink | Utama (35%+) | Hardware accelerated CSS animations, WebSocket Realtime, WebP/AVIF format. |
| **Samsung Internet** | Blink | Sekunder (3%) | Audio unlock, Lenis momentum smooth scroll. |
| **Desktop Safari / Chrome** | WebKit / Blink | Penunjang (<2%) | Responsive layout editorial, mouse wheel smooth scroll. |
