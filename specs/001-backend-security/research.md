# Research & Technical Decisions: Backend Security, Immutable Configuration & Database Foundation

**Feature**: `001-backend-security`
**Date**: 2026-09-19
**Status**: Completed

## 1. Immutable Financial Data Architecture

- **Decision**: Simpan data rekening bank (BCA, Mandiri) dan metadata QRIS sebagai konstanta server imutabel bertipe `as const` di `src/lib/config/wedding-data.ts`.
- **Rationale**: Menghilangkan 100% risiko modifikasi rekening tujuan transfer kado melalui kebocoran API key, SQL injection, atau manipulasi row database. Perubahan rekening hanya dapat terjadi melalui rilis kode resmi via commit Git terverifikasi.
- **Alternatives Considered**:
  - *Tabel database dengan RLS read-only*: Ditolak karena API key yang bocor atau admin dashboard yang disusupi tetap dapat memutasi data.
  - *Environment variables (.env)*: Ditolak karena format string JSON di .env rentan kesalahan parsing dan kurang memiliki type safety ketat.

## 2. Rate Limiting Strategy (Maksimal 3 Submit per IP per 10 Menit)

- **Decision**: In-Memory Sliding Window berbasis `Map` di server Node.js dipadukan dengan Database Query Fallback memanfaatkan indeks komposit `idx_rsvps_ip_created (ip_hash, created_at DESC)` pada tabel `public.rsvps`.
- **Rationale**: Sesuai prinsip `/ponytail full` (Ladder of Restraint). Layer 1 in-memory memberikan penolakan seketika (0 ms) terhadap flood serangan spam cepat tanpa membebani database. Layer 2 fallback memeriksa riwayat database untuk memastikan batasan tetap konsisten jika terjadi container restart pada lingkungan serverless. Tidak memerlukan Redis/Upstash tambahan atau tabel counter terpisah.
- **Alternatives Considered**:
  - *Redis / Upstash*: Ditolak karena menambah dependensi eksternal berbayar, biaya latensi jaringan, dan kompleksitas credential.
  - *Tabel dedikasi `public.rate_limit_bucket`*: Ditolak karena redundan dengan data riwayat `public.rsvps` yang sudah memiliki indeks `(ip_hash, created_at DESC)`.

## 3. Supabase SSR Client & Privilege Model

- **Decision**: Gunakan `@supabase/ssr` (`createBrowserClient` di browser dan `createServerClient` di Server Action dengan `await cookies()`) menggunakan **Anon Key** (Prinsip Least Privilege).
- **Rationale**: Memastikan seluruh operasi mutasi Server Action tunduk pada kebijakan *Row Level Security (RLS)* PostgreSQL (`Public can submit RSVP`). Menghindari penggunaan `service_role` secara berlebihan sehingga database engine tetap memvalidasi constraint dan RLS.
- **Alternatives Considered**:
  - *Supabase Service Role Key di Server Action*: Ditolak karena membypass seluruh RLS dan meningkatkan blast radius jika terjadi celah logika.
  - *Supabase Client v2 standar (`@supabase/supabase-js`)*: Ditolak untuk SSR karena tidak mengelola sinkronisasi cookie Next.js 15 secara optimal.

## 4. Input Sanitization & Anti-Phishing Pipeline

- **Decision**: Pendekatan berlapis *Zero-Trust*:
  1. Zod Schema Validation (batas karakter ketat: nama 2–60, pesan 3–500, pax 1–5).
  2. Anti-Phishing URL Blocker: Regex penolak tautan `/(https?:\/\/|www\.|\.com|\.org|\.net|\.id|\.xyz|bit\.ly|t\.me)/i`.
  3. Server-side `DOMPurify` (`isomorphic-dompurify`) untuk melucuti semua tag HTML/SVG/XML (`ALLOWED_TAGS: []`, `ALLOWED_ATTR: []`, `KEEP_CONTENT: true`).
  4. Safe React interpolation: `<p>{item.message}</p>` tanpa `dangerouslySetInnerHTML`.
- **Rationale**: Menjamin buku tamu terbebas dari serangan Stored XSS, spam link judi online, atau tautan phishing APK palsu.
- **Alternatives Considered**:
  - *Escape HTML manual*: Ditolak karena rentan lolos pada payload XSS tingkat lanjut dan SVG nesting.
  - *Markdown support di pesan*: Ditolak karena markdown dapat disusupi tautan markdown `[klik](https://...)` dan format teks berlebih yang merusak estetika editorial.

## 5. Cloudflare Turnstile Verification & Testing Mock

- **Decision**: Verifikasi token Turnstile server-to-server ke `https://challenges.cloudflare.com/turnstile/v0/siteverify`. Mendukung official Cloudflare Test Keys (`1x000...`) pada lingkungan dev, serta penanganan deterministik pada `NODE_ENV === 'test'` agar unit test Vitest berjalan instan offline.
- **Rationale**: Mencegah bot spam tanpa mengganggu tamu dengan CAPTCHA gambar manual (invisible challenge) dan menjaga kecepatan eksekusi test suite CI.
- **Alternatives Considered**:
  - *Google reCAPTCHA v2/v3*: Ditolak karena pelacakan privasi pihak ketiga dan UX puzzle yang menurunkan konversi tamu.
  - *Fetch langsung ke Cloudflare saat unit testing*: Ditolak karena membuat test suite lambat dan flaky akibat ketergantungan internet.

## 6. Edge Security Middleware & Content Security Policy (CSP)

- **Decision**: Static Strict CSP pada `src/middleware.ts` dengan whitelist domain resmi (Supabase, Cloudflare Challenges, Google Fonts) dipadukan dengan header HSTS 2 tahun, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, dan `Permissions-Policy`.
- **Rationale**: Mencegah clickjacking, MIME sniffing, dan eksekusi skrip dari domain luar yang tidak sah tanpa memicu masalah hidrasi SSR (*hydration mismatch*).
- **Alternatives Considered**:
  - *Dynamic nonce per-request*: Ditolak untuk fase ini karena berisiko memicu SSR hydration mismatch pada komponen statis Next.js 15 tanpa memberikan nilai tambah signifikan dibandingkan whitelist ketat.
