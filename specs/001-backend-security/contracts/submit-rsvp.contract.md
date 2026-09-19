# Interface Contract: `submitRSVP` Server Action

**Action Location**: `src/actions/submit-rsvp.ts`
**Directive**: `'use server'`
**Invocation Protocol**: Next.js Server Action RPC (POST)

## 1. Request Interface

```typescript
export interface RSVPInput {
  guest_name: string;          // 2-60 characters (trimmed)
  attendance_status: 'attending' | 'declined';
  pax_count: number;           // Integer between 1 and 5
  message: string;             // 3-500 characters (trimmed, no URLs)
  turnstile_token: string;     // Cloudflare Turnstile token
}
```

### Aturan Validasi Input

| Bidang | Tipe | Wajib? | Aturan Validasi | Pesan Kegagalan |
| :--- | :--- | :---: | :--- | :--- |
| `guest_name` | `string` | Ya | `min(2), max(60)` | "Nama tamu minimal 2 karakter." / "Nama tamu maksimal 60 karakter." |
| `attendance_status` | `enum` | Ya | `'attending'` \| `'declined'` | "Pilih konfirmasi kehadiran yang valid." |
| `pax_count` | `number` | Ya | `int(), min(1), max(5)` | "Jumlah tamu minimal 1 orang." / "Jumlah tamu maksimal 5 orang." |
| `message` | `string` | Ya | `min(3), max(500)` | "Pesan ucapan minimal 3 karakter." / "Pesan ucapan maksimal 500 karakter." |
| `turnstile_token` | `string` | Ya | `min(1)` | "Verifikasi keamanan captcha wajib diisi." |

---

## 2. Response Interface

```typescript
export type ActionResponse<T = unknown> = 
  | { success: true; data: T }
  | { success: false; error: string; details?: Record<string, string[]> };

export interface RSVPRecordOutput {
  id: string;
  guest_name: string;
  attendance_status: 'attending' | 'declined';
  pax_count: number;
  message: string;
  created_at: string;
}
```

> **Catatan Keamanan**: Kolom `ip_hash` **DILARANG** disertakan pada objek respons `RSVPRecordOutput`.

---

## 3. Error Codes & User Messages

| Kode Error | Kondisi Pemicu | Pesan Pengguna (Bahasa Indonesia Santun) |
| :--- | :--- | :--- |
| `FORM_DISABLED` | `EMERGENCY_FEATURE_FLAGS.isGuestbookFormActive === false` | "Penerimaan ucapan digital sementara ditutup. Terima kasih atas doa restunya." |
| `RATE_LIMIT_EXCEEDED` | Jumlah pengiriman > 3 dalam 10 menit untuk IP yang sama | "Mohon tunggu sejenak. Anda telah mengirim beberapa pesan dalam waktu singkat." |
| `BOT_DETECTED` | Verifikasi token Turnstile gagal / terindikasi bot | "Verifikasi keamanan captcha tidak berhasil. Silakan coba kembali." |
| `VALIDATION_ERROR` | Gagal validasi skema Zod pada salah satu field | "Format data yang dikirimkan tidak sesuai ketentuan." (disertai `details`) |
| `LINKS_NOT_ALLOWED` | Pesan memuat tautan URL / phishing pattern | "Pesan doa restu tidak diperkenankan memuat tautan atau link website." |
| `DATABASE_ERROR` | Kesalahan koneksi atau query basis data Supabase | "Terjadi kendala teknis saat menyimpan data. Silakan coba beberapa saat lagi." |
