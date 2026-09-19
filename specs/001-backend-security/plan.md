# Implementation Plan: Backend Security, Immutable Configuration & Database Foundation

**Branch**: `001-backend-security` | **Date**: 2026-09-19 | **Spec**: [`specs/001-backend-security/spec.md`](spec.md)

**Input**: Feature specification from `specs/001-backend-security/spec.md`

## Summary

Mengimplementasikan fondasi backend dan keamanan menyeluruh untuk undangan pernikahan digital eksklusif:
1. Konfigurasi data finansial kado pernikahan (BCA, Mandiri, QRIS) dan flag pemutus darurat sebagai konstanta server imutabel (`as const`).
2. Skema migrasi PostgreSQL Supabase idempoten dengan batasan integritas, enum kehadiran, indeks komposit performa tinggi, dan kebijakan *Row Level Security (RLS)* deklaratif.
3. Supabase client browser & server berbasis `@supabase/ssr` dengan prinsip hak akses terendah (*Least Privilege* menggunakan Anon Key).
4. Pipeline sanitasi *Zero-Trust*: validasi Zod ketat, pelucutan XSS HTML/SVG via `isomorphic-dompurify`, serta blokir total tautan URL/phishing.
5. Sistem pertahanan bot dan banjir pesan: verifikasi Cloudflare Turnstile terintegrasi dan rate limiter hibrida sliding-window dengan database query fallback berbasis hash SHA-256 IP tersalt.
6. Server Action Next.js 15 `submitRSVP` terorkestrasi aman dengan format amplop `ActionResponse<T>`.
7. Edge Security Middleware dengan Content Security Policy (CSP) ketat dan header pertahanan HSTS.

## Technical Context

**Language/Version**: TypeScript 5.6+ (Strict Mode: `noImplicitAny: true`, `strictNullChecks: true`)
**Primary Dependencies**: Next.js 15.1 (App Router, Server Actions), React 19, `@supabase/ssr` (^0.5.1), `@supabase/supabase-js` (^2.45.4), `zod` (^3.23.8), `isomorphic-dompurify` (^2.16.0)
**Storage**: PostgreSQL 15+ (Supabase Managed Cloud) dengan RLS dan Publikasi Realtime
**Testing**: Vitest (^2.1.1) + React Testing Library + JSDOM
**Target Platform**: Node.js 20+ Runtime & Vercel Edge Runtime (Middleware)
**Project Type**: Fullstack Web Application (Next.js App Router)
**Performance Goals**: Waktu respons Server Action < 1.5 detik pada jaringan seluler; index scan database $\mathcal{O}(\log N)$
**Constraints**: Zero plain IP logging (Salted SHA-256); zero bank accounts in database; zero `dangerouslySetInnerHTML`; initial bundle $\le 90\text{ KB}$ gzipped
**Scale/Scope**: Mampu melayani ribuan tamu undangan dengan proteksi laju maksimal 3 pengiriman per IP per 10 menit

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Prinsip Konstitusi | Status Evaluasi | Justifikasi Teknis |
| :--- | :---: | :--- |
| **Prinsip I: SSoT Desain & Estetika Editorial** | **PASS** | Format copy pesan validasi dan respon error menggunakan Bahasa Indonesia santun (*"Pesan doa restu tidak diperkenankan memuat tautan..."*). |
| **Prinsip II: Zero-Trust Keamanan Finansial** | **PASS** | Rekening BCA, Mandiri, dan QRIS disimpan sebagai server-only constant `as const` di `wedding-data.ts`. Zero database tables/endpoints for financial data. |
| **Prinsip III: Sanitasi Input Berlapis & Anti-Abuse** | **PASS** | Validasi Zod + Regex blokir tautan phishing + DOMPurify stripping + Salted SHA-256 IP hash + Turnstile + Rate limiter (3 submit / 10 menit). |
| **Prinsip IV: 60 FPS & Autoplay Compliance** | **PASS** | Tidak ada dependensi berat di sisi klien. Modul backend murni server-side, tidak membebani render thread browser. |
| **Prinsip V: Server Components & Strict TypeScript** | **PASS** | Server Action `'use server'` dengan `ActionResponse<T>`, RLS enabled di PostgreSQL, `await cookies()` kompatibel Next.js 15, zero `any`. |
| **Keamanan HTTP (Middleware CSP)** | **PASS** | Content Security Policy ketat, HSTS 2 tahun, X-Frame-Options DENY, X-Content-Type-Options nosniff di `middleware.ts`. |
| **Siklus Loop Rekayasa 5-Fase & TDD** | **PASS** | Perencanaan mencakup penulisan unit test Vitest terlebih dahulu (*Red*) sebelum kode modul dibuat (*Green*). |

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-security/
├── plan.md              # Implementasi rencana teknis komprehensif
├── research.md          # Hasil konsolidasi riset arsitektur teknis
├── data-model.md        # Skema data PostgreSQL, interface, dan indeks
├── quickstart.md        # Panduan verifikasi dan pengujian otomatis
├── contracts/           # Kontrak antarmuka Server Action & Security Headers
│   ├── submit-rsvp.contract.md
│   └── security-headers.contract.md
├── checklists/
│   └── requirements.md  # Checklist mutu spesifikasi
└── spec.md              # Spesifikasi fitur tervalidasi
```

### Source Code (repository root)

```text
src/
├── actions/
│   └── submit-rsvp.ts          # Next.js 15 Server Action (eksekusi mutasi RSVP)
├── lib/
│   ├── config/
│   │   └── wedding-data.ts     # Konstanta imutabel server (rekening & kill switch)
│   ├── security/
│   │   ├── ip.ts               # Ekstraksi IP & salted SHA-256 hashing
│   │   ├── sanitize.ts         # Server DOMPurify & deteksi pola link phishing
│   │   ├── turnstile.ts        # Verifikasi token Cloudflare Turnstile
│   │   └── rate-limit.ts       # Rate limiter in-memory sliding window + DB query fallback
│   ├── supabase/
│   │   ├── client.ts           # Browser client (@supabase/ssr createBrowserClient)
│   │   └── server.ts           # Server client (@supabase/ssr createServerClient with await cookies())
│   └── validations/
│       └── rsvp-schema.ts      # Skema Zod & tipe TypeScript (RSVPInput, ActionResponse)
├── middleware.ts               # Edge middleware untuk CSP, HSTS, dan security headers
supabase/
└── migrations/
    └── 00001_initial_schema.sql # Skrip migrasi PostgreSQL Supabase idempoten

tests/
└── unit/
    ├── wedding-data.test.ts    # Unit test immutabilitas rekening & flags
    ├── sanitize.test.ts        # Unit test anti-phishing regex & DOMPurify
    ├── ip.test.ts              # Unit test salted SHA-256 IP hashing
    ├── rate-limit.test.ts      # Unit test sliding window rate limiter
    ├── turnstile.test.ts       # Unit test verifikasi Cloudflare Turnstile
    ├── submit-rsvp.test.ts     # Unit test alur lengkap Server Action
    └── middleware.test.ts      # Unit test HTTP security headers & CSP
```

**Structure Decision**: Menggunakan arsitektur Next.js 15 App Router tunggal dengan modul utilitas terisolasi di `src/lib/`, Server Actions di `src/actions/`, skrip migrasi resmi di `supabase/migrations/`, dan pengujian unit terpusat di `tests/unit/`.

## Complexity Tracking

*Tidak ada pelanggaran konstitusi. Seluruh prinsip governance dan Definition of Done dipatuhi 100% tanpa simplifikasi spekulatif atau abstraksi berlebih (Zero Bloat).*
