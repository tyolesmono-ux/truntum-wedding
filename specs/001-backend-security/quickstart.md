# Quickstart Validation Guide: Backend Security & Database Foundation

**Feature**: `001-backend-security`
**Date**: 2026-09-19

Panduan ini berisi langkah-langkah verifikasi menyeluruh untuk membuktikan bahwa subsistem backend keamanan, basis data Supabase, dan Server Action beroperasi sempurna sesuai spesifikasi.

## 1. Prerequisites (Prasyarat Lingkungan)

- Node.js `v20+` dan pnpm `v9+` terpasang.
- Variabel lingkungan dasar tercatat pada `.env.local` (merujuk pada `.env.example`):
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
  IP_SALT_SECRET=test-salt-secret-key-32-chars-long
  ```

---

## 2. Database Migration Setup (Supabase)

1. Buka Supabase Studio / SQL Editor untuk proyek Anda.
2. Jalankan skrip SQL idempoten dari berkas:
   [`supabase/migrations/00001_initial_schema.sql`](../../supabase/migrations/00001_initial_schema.sql)
3. Verifikasi ketersediaan:
   - Tipe enum `attendance_enum` terdaftar.
   - Tabel `public.rsvps` terbuat dengan 3 constraint (`check_guest_name_not_empty`, `check_pax_count_range`, `check_message_not_empty`).
   - Indeks `idx_rsvps_created_at` dan `idx_rsvps_ip_created` aktif.
   - RLS aktif dengan 3 policy terdaftar.
   - Tabel terdaftar dalam publikasi `supabase_realtime`.

---

## 3. Automated Verification Commands (Pengujian Otomatis)

Jalankan rangkaian unit test otomatis Vitest yang mencakup seluruh lapisan keamanan, sanitasi, rate limiter, dan Server Action:

```bash
# 1. Jalankan seluruh unit test
pnpm test

# 2. Jalankan type checking statis (wajib 0 error)
pnpm typecheck

# 3. Jalankan linter ESLint (wajib 0 error dan 0 warning)
pnpm lint
```

### Hasil Pengujian yang Diharapkan:
- `tests/unit/wedding-data.test.ts`: 100% lulus (immutabilitas data rekening bank).
- `tests/unit/sanitize.test.ts`: 100% lulus (XSS stripping & URL blocking).
- `tests/unit/ip.test.ts`: 100% lulus (salted SHA-256 IP hashing).
- `tests/unit/rate-limit.test.ts`: 100% lulus (blokir submission ke-4 dalam 10 menit).
- `tests/unit/turnstile.test.ts`: 100% lulus (verifikasi token Cloudflare & mock test).
- `tests/unit/submit-rsvp.test.ts`: 100% lulus (validasi Zod, sanitasi pesan, error handling).
- `tests/unit/middleware.test.ts`: 100% lulus (CSP, HSTS, X-Frame-Options, Permissions-Policy).

---

## 4. Manual Verification Flow (Uji Coba Lapangan)

1. **Uji Coba Penolakan URL (Anti-Phishing)**:
   - Kirim ucapan dengan teks: `"Kunjungi website https://judi-online.xyz ya!"`.
   - **Hasil Diharapkan**: Server Action menolak dengan pesan *"Pesan doa restu tidak diperkenankan memuat tautan atau link website."* (Error code: `LINKS_NOT_ALLOWED`).
2. **Uji Coba Sanitasi Tag HTML**:
   - Kirim ucapan dengan teks: `"<script>alert(1)</script><b>Selamat Bahagia</b>"`.
   - **Hasil Diharapkan**: Server Action menerima dan menyimpan teks murni: `"Selamat Bahagia"`.
3. **Uji Coba Rate Limiting**:
   - Kirim form 3 kali berturut-turut dengan data valid. Seluruh 3 submit sukses.
   - Pada pengiriman ke-4 dalam 10 menit dari IP yang sama: Server Action menolak dengan pesan *"Mohon tunggu sejenak. Anda telah mengirim beberapa pesan dalam waktu singkat."* (Error code: `RATE_LIMIT_EXCEEDED`).
4. **Uji Coba Immutabilitas Finansial**:
   - Pastikan nomor rekening BCA dan Mandiri dimuat langsung dari `src/lib/config/wedding-data.ts` tanpa melakukan query SELECT ke tabel database.
