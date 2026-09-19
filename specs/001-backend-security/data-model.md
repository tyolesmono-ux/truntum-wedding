# Data Model: Backend Security & Database Foundation

**Feature**: `001-backend-security`
**Date**: 2026-09-19
**Database Engine**: PostgreSQL 15+ (Supabase Managed Cloud)

## 1. Relational Database Schema (`public.rsvps`)

Tabel utama penyimpan konfirmasi kehadiran dan ucapan doa restu tamu.

```sql
CREATE TYPE attendance_enum AS ENUM ('attending', 'declined');

CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(60) NOT NULL,
    attendance_status attendance_enum NOT NULL,
    pax_count SMALLINT NOT NULL DEFAULT 1,
    message VARCHAR(500) NOT NULL,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_guest_name_not_empty CHECK (char_length(trim(guest_name)) > 0),
    CONSTRAINT check_pax_count_range CHECK (pax_count BETWEEN 1 AND 5),
    CONSTRAINT check_message_not_empty CHECK (char_length(trim(message)) > 0)
);
```

### Kamus Kolom (Data Dictionary)

| Kolom | Tipe | Nullable | Default | Batasan & Validasi | Deskripsi |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `id` | `UUID` | Tidak | `gen_random_uuid()` | Primary Key | Identifier unik entitas ucapan/RSVP. |
| `guest_name` | `VARCHAR(60)` | Tidak | - | Panjang 2–60 karakter (setelah trim) | Nama tamu undangan yang memberikan ucapan. |
| `attendance_status` | `attendance_enum` | Tidak | - | `'attending'` atau `'declined'` | Status kepastian kehadiran acara. |
| `pax_count` | `SMALLINT` | Tidak | `1` | `1 <= pax_count <= 5` | Jumlah tamu yang hadir bersama pengirim. |
| `message` | `VARCHAR(500)` | Tidak | - | Panjang 3–500 karakter; bebas HTML & URL | Isi pesan ucapan doa restu yang telah disanitasi. |
| `ip_hash` | `VARCHAR(64)` | Ya | `NULL` | SHA-256 Hex String (64 char) | Hash anonim alamat IP pengirim untuk audit rate limit. |
| `created_at` | `TIMESTAMPTZ` | Tidak | `timezone('utc', now())` | Zona waktu UTC | Stempel waktu pengiriman data. |

### Indeks Performa

1. `idx_rsvps_created_at ON public.rsvps (created_at DESC)`:
   - Mengoptimalkan kueri feed live guestbook dengan pengurutan kronologis terbalik ($\mathcal{O}(\log N)$ index scan).
2. `idx_rsvps_ip_created ON public.rsvps (ip_hash, created_at DESC)`:
   - Mengoptimalkan pengecekan rate limiting fallback (`created_at > now() - interval '10 minutes'`).

### Row Level Security (RLS) Policies

1. **`Public can view sanitized wishes`** (SELECT):
   - Scope: `TO anon, authenticated`
   - Using: `true`
   - Keterangan: Seluruh tamu dapat membaca feed ucapan yang sudah tersimpan.
2. **`Public can submit RSVP`** (INSERT):
   - Scope: `TO anon, authenticated`
   - With Check: `true`
   - Keterangan: Publik dapat mengirimkan baris ucapan baru melalui Server Action.
3. **`Only admin can modify rsvps`** (UPDATE & DELETE):
   - Scope: `TO service_role`
   - Using: `true`
   - Keterangan: Publik dilarang memodifikasi atau menghapus pesan yang telah tersimpan.

### Realtime Change Data Capture (CDC)

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;
```

---

## 2. Server-Only Immutable Constants (`src/lib/config/wedding-data.ts`)

Struktur data kado finansial dan flag darurat yang sepenuhnya diisolasi dari database.

```typescript
export interface BankAccount {
  readonly bankName: string;
  readonly accountNumber: string;
  readonly accountHolder: string;
  readonly copyPayload: string;
}

export interface QrisConfig {
  readonly imageUrl: string;
  readonly altText: string;
  readonly merchantName: string;
}

export interface WeddingGiftConfig {
  readonly accounts: readonly BankAccount[];
  readonly qris: QrisConfig;
}

export interface EmergencyFeatureFlags {
  readonly isGuestbookFormActive: boolean;
  readonly isRealtimeBroadcastActive: boolean;
}
```

---

## 3. Transient State & Cache Models

### Rate Limit Sliding Window Entry (`src/lib/security/rate-limit.ts`)
```typescript
interface RateLimitRecord {
  count: number;
  expiresAt: number; // UNIX timestamp (ms)
}
// In-Memory Storage: Map<string, RateLimitRecord>
// Key: salted ip_hash (64-char hex)
// Threshold: max 3 requests per 10 minutes (600,000 ms)
```
