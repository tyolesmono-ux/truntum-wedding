# Data Model & Schema Specification: Seksi Linimasa Kisah Cinta & Galeri Sinematik (Fase 3B)

**Feature**: `003b-editorial-story-gallery`  
**Date**: 2026-09-19  
**Acuan SSoT**: [`DESIGN.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/DESIGN.md), [`wedding-content.ts`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/src/lib/config/wedding-content.ts)

---

## 1. Entities & TypeScript Interfaces

Data untuk kedua seksi ini bersifat statis, baca-saja (*immutable*), dan diintegrasikan ke dalam modul konfigurasi editorial `src/lib/config/wedding-content.ts` menggunakan `deepFreeze` dan `as const`.

### 1.1 Entitas `LoveStoryMilestone`

Mewakili satu babak peristiwa dalam linimasa perjalanan cinta kedua mempelai.

```typescript
export interface LoveStoryMilestone {
  /** Pengenal unik babak kisah untuk key rendering dan tracking (kebab-case) */
  readonly id: string;
  /** Angka tahun peristiwa untuk tipografi Didone Bodoni Moda (misal: '2021') */
  readonly year: string;
  /** Keterangan waktu, bulan, atau musim yang santun (misal: 'Musim Gugur 2021') */
  readonly period: string;
  /** Judul babak editorial perjalanan cinta (misal: 'Awal Jumpa di Balairung Ageng') */
  readonly title: string;
  /** Narasi puitis bahasa Indonesia yang santun dan anggun (150–300 karakter) */
  readonly story: string;
}
```

#### Aturan Validasi & Batasan:
- `id`: Non-empty string, format slug/kebab-case, unik di antara seluruh babak.
- `year`: String tahun 4 digit (`^\d{4}$`).
- `period`: String teks santun, panjang 5–40 karakter.
- `title`: String judul formal *sentence case*, panjang 10–60 karakter.
- `story`: String narasi puitis, panjang 50–500 karakter, dilarang memuat tautan atau tag HTML.

---

### 1.2 Entitas `GalleryPhoto`

Mewakili satu item foto kurasi berformat editorial dalam galeri sinematik.

```typescript
export interface GalleryPhoto {
  /** Pengenal unik foto kurasi (misal: 'gallery-01') */
  readonly id: string;
  /** Jalur aset foto format WebP/AVIF lokal atau CDN terverifikasi */
  readonly src: string;
  /** Teks deskripsi aksesibilitas untuk pembaca layar (screen reader) */
  readonly alt: string;
  /** Lebar intrinsik gambar dalam satuan piksel (untuk rasio aspek) */
  readonly width: number;
  /** Tinggi intrinsik gambar dalam satuan piksel (untuk rasio aspek) */
  readonly height: number;
  /** Format tata letak editorial majalah: 'landscape' (16:9) atau 'portrait' (3:4) */
  readonly aspectRatio: 'landscape' | 'portrait';
  /** Keterangan foto editorial opsional yang tampil di bilah bawah Lightbox */
  readonly caption?: string;
  /** Data URL placeholder warna Kertas Batik (#E8DCC8) untuk transisi muat gambar */
  readonly blurDataUrl?: string;
}
```

#### Aturan Validasi & Batasan:
- `id`: Non-empty string, unik di antara seluruh foto galeri.
- `src`: Path berkas yang valid diawali `/images/gallery/` atau URL aman `https://`.
- `alt`: Teks deskripsi bahasa Indonesia yang bermakna, panjang 10–100 karakter (bukan string kosong atau teks generik "foto").
- `width` & `height`: Integer positif, rasio harus konsisten dengan `aspectRatio`:
  - `'landscape'`: $width / height \approx 16/9$ (misal: $1200 \times 675$ atau $1200 \times 800$).
  - `'portrait'`: $width / height \approx 3/4$ (misal: $900 \times 1200$ atau $1200 \times 1600$).
- `caption`: Teks opsional, maksimal 120 karakter.

---

## 2. Perluasan Antarmuka `WeddingContentConfig`

Modul konfigurasi utama `WeddingContentConfig` di `src/lib/config/wedding-content.ts` diperluas dengan dua properti baru:

```typescript
export interface WeddingContentConfig {
  readonly couple: {
    readonly groom: WeddingPerson;
    readonly bride: WeddingPerson;
  };
  readonly quote: SacredQuote;
  readonly countdownTargetDate: string;
  readonly events: readonly WeddingEventSession[];
  readonly hero: {
    readonly locationCity: string;
    readonly dateFormal: string;
    readonly coverImageUrl: string;
  };
  // === Perluasan Fase 3B ===
  readonly loveStory: readonly LoveStoryMilestone[];
  readonly gallery: readonly GalleryPhoto[];
}
```

---

## 3. Data Default Kurasi (Seed Data)

### 3.1 Babak Love Story (3 Milestone)
1. **Babak I (2021)**:
   - `id`: `'pertemuan-pertama'`
   - `year`: `'2021'`
   - `period`: `'Agustus 2021'`
   - `title`: `'Awal Mula Pertemuan'`
   - `story`: `'Di bawah naungan keteduhan kota Surakarta, takdir mempertemukan dua insan dalam perbincangan santun yang menumbuhkan rasa saling percaya dan saling menghargai.'`
2. **Babak II (2024)**:
   - `id`: `'ikrar-komitmen'`
   - `year`: `'2024'`
   - `period`: `'Mei 2024'`
   - `title`: `'Menjalin Doa dan Komitmen'`
   - `story`: `'Seiring berjalannya waktu dan kedewasaan hati, doa-doa yang terpanjat perlahan menemukan muaranya untuk saling menjaga, melangkah beriringan, dan memohon ridho kedua orang tua.'`
3. **Babak III (2026)**:
   - `id`: `'menuju-pelaminan'`
   - `year`: `'2026'`
   - `period`: `'Oktober 2026'`
   - `title`: `'Langkah Menuju Janji Suci'`
   - `story`: `'Dengan restu dan doa tulus seluruh keluarga besar, kami memantapkan niat suci untuk mengikat janji setia dalam bingkai pernikahan yang sakral dan penuh berkah.'`

### 3.2 Kurasi Foto Galeri (7 Foto)
- **Foto 1**: Landscape 16:9 full-width (Momen Berdua di Pelataran Keraton)
- **Foto 2**: Portrait 3:4 (Potret Mempelai Berbusana Tradisional Solo)
- **Foto 3**: Portrait 3:4 (Detail Selendang Batik Sogan & Aksesoris)
- **Foto 4**: Landscape 16:9 full-width (Latar Arsitektur Klasik Surakarta)
- **Foto 5**: Portrait 3:4 (Potret Wajah Lembut & Senyuman Tulus)
- **Foto 6**: Portrait 3:4 (Genggaman Tangan dalam Doa Bersama)
- **Foto 7**: Landscape 16:9 full-width (Siluet Senja di Balai Kota)

---

## 4. State Transitions (Lightbox Modal)

```
       [Tertutup / Hidden]
               │
               ▼ (Klik Thumbnail Foto: setSelectedIndex(i), setIsOpen(true))
      [Membuka / Opening]
   (Lenis.stop(), overflow:hidden,
    scale: 0.95 → 1, opacity: 0 → 1)
               │
               ▼
        [Terbuka / Idle]
     ┌─────────┴─────────┐
     │ (Swipe/Arrow Left)│ (Swipe/Arrow Right)
     ▼                   ▼
 [Navigasi Prev]     [Navigasi Next]
     │                   │
     └─────────┬─────────┘
               │ (Swipe Down / Esc / Klik X: setIsOpen(false))
               ▼
      [Menutup / Closing]
   (Lenis.start(), overflow:'',
    scale: 1 → 0.95, opacity: 1 → 0)
               │
               ▼
       [Tertutup / Hidden]
```
