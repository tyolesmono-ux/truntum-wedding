# UI Component Contracts & Props Specifications (Fase 3B)

**Feature**: `003b-editorial-story-gallery`  
**Date**: 2026-09-19  
**Status**: Ratified  
**Acuan SSoT**: [`DESIGN.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/DESIGN.md), [`spec.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/specs/003b-editorial-story-gallery/spec.md)

---

## 1. Komponen `LoveStoryTimeline`

Seksi editorial linimasa kisah cinta vertikal (*left-rail*) berlatar Malam Wulung (`#15120F`) dengan garis progres emas terikat pengguliran layar (*scroll-linked*).

### 1.1 Props Contract

```typescript
export interface LoveStoryTimelineProps {
  /** Daftar babak linimasa kisah cinta (minimal 2, ideal 3–4 babak) */
  readonly milestones: readonly LoveStoryMilestone[];
  /** Kelas CSS tambahan opsional untuk styling kontainer terluar */
  readonly className?: string;
}
```

### 1.2 DOM & Accessibility Attributes Contract
- Kontainer utama: `<section aria-label="Linimasa kisah cinta" className="relative bg-[#15120F] text-[#EFE6D6] py-24 sm:py-32 overflow-hidden">`
- Garis waktu: `<div role="progressbar" aria-label="Progres kisah cinta" aria-valuemin={0} aria-valuemax={100} ...>`
- Setiap item babak: `<article aria-labelledby={`milestone-title-${milestone.id}`} className="...">`
- Tahun babak: `<time dateTime={milestone.year} className="font-display text-2xl sm:text-3xl text-[#C2A05B]">`

### 1.3 State & Motion Behaviors
- Menggunakan `useScroll` dengan target kontainer `timelineRef`.
- `scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])` diterapkan pada garis aktif emas (`#C2A05B`) dengan `originY: 0`.
- Saat `prefers-reduced-motion: reduce`, `scaleY` diatur konstan `1` dan elemen teks ditampilkan tanpa efek animasi stagger.

---

## 2. Komponen `GalleryMasonry`

Seksi kurasi galeri foto majalah seni asimetris (*asymmetric editorial spread*) bentang penuh (*full-bleed edge-to-edge*).

### 2.1 Props Contract

```typescript
export interface GalleryMasonryProps {
  /** Daftar foto kurasi editorial (format landscape 16:9 & portrait 3:4) */
  readonly photos: readonly GalleryPhoto[];
  /** Kelas CSS tambahan opsional untuk kontainer seksi */
  readonly className?: string;
}
```

### 2.2 DOM & Accessibility Attributes Contract
- Kontainer utama: `<section aria-label="Galeri foto sinematik" className="relative bg-[#15120F] py-20 sm:py-28">`
- Setiap kartu/thumbnail foto:
  - `<button type="button" aria-label={`Buka foto: ${photo.alt}`} onClick={() => openLightbox(index)} className="group relative block w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#C2A05B] focus:ring-offset-2 focus:ring-offset-[#15120F]">`
- Elemen gambar Next.js `<Image>` dengan atribut:
  - `src`, `alt`, `width`, `height`, `sizes` responsif, dan `placeholder="blur"` dengan `blurDataURL`.

---

## 3. Komponen `LightboxModal`

Modal tampilan penuh foto resolusi tinggi dengan navigasi gestur sentuh (usap horizontal & usap ke bawah untuk menutup), kontrol keyboard, bilah atas indikator foto, dan bilah bawah teks keterangan foto (*caption*).

### 3.1 Props Contract

```typescript
export interface LightboxModalProps {
  /** Status keterbukaan modal */
  readonly isOpen: boolean;
  /** Indeks foto aktif saat ini (0-indexed) */
  readonly activeIndex: number;
  /** Daftar lengkap foto yang dapat dijelajahi */
  readonly photos: readonly GalleryPhoto[];
  /** Callback saat modal ditutup */
  readonly onClose: () => void;
  /** Callback saat pengguna berpindah ke indeks foto tertentu */
  readonly onNavigate: (newIndex: number) => void;
}
```

### 3.2 Key Interaction & Keyboard Mapping
| Pemicu Interaksi | Aksi yang Dijalankan |
| :--- | :--- |
| **Tombol `Escape`** | Memanggil `onClose()` untuk menutup modal |
| **Tombol `ArrowLeft`** | Memanggil `onNavigate(activeIndex - 1)` (dibatasi pada indeks 0) |
| **Tombol `ArrowRight`** | Memanggil `onNavigate(activeIndex + 1)` (dibatasi pada indeks `total - 1`) |
| **Sentuhan Usap Kiri (`Swipe Left`)** | Navigasi ke foto berikutnya (`activeIndex + 1`) jika $\Delta X < -60\text{px}$ |
| **Sentuhan Usap Kanan (`Swipe Right`)** | Navigasi ke foto sebelumnya (`activeIndex - 1`) jika $\Delta X > 60\text{px}$ |
| **Sentuhan Usap Bawah (`Swipe Down`)** | Menutup modal (`onClose()`) jika $\Delta Y > 100\text{px}$ |
| **Ketukan Ganda (`Double Tap`)** | Toggle perbesaran gambar (1× $\leftrightarrow$ 2×) |
| **Klik Backdrop Luar** | Menutup modal (`onClose()`) |

### 3.3 DOM Structure & Overlay Anatomy
```html
<div role="dialog" aria-modal="true" aria-label="Pratinjau foto resolusi penuh" className="fixed inset-0 z-50 flex flex-col bg-[#15120F]/95 backdrop-blur-sm">
  <!-- Bilah Atas: Counter & Tombol Tutup -->
  <header className="flex h-16 items-center justify-between px-6 text-[#EFE6D6]">
    <span className="font-sans font-medium text-sm tabular-nums tracking-widest text-[#C2A05B]">
      {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
    </span>
    <button aria-label="Tutup pratinjau foto" onClick={onClose} className="p-2 min-h-[44px] min-w-[44px] text-[#EFE6D6] hover:text-[#C2A05B]">
      <X size={24} />
    </button>
  </header>

  <!-- Area Foto Tengah Interaktif -->
  <main className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
    <!-- Tombol Navigasi Desktop Kiri & Kanan (44x44px touch target) -->
    <!-- Elemen Foto Aktif motion.div dengan gesture handlers -->
  </main>

  <!-- Bilah Bawah: Caption Foto Editorial -->
  <footer className="min-h-[56px] flex items-center justify-center px-6 py-3 text-center bg-[#15120F]/80">
    <p className="font-sans text-sm text-[#EFE6D6] max-w-xl mx-auto line-clamp-2">
      {photos[activeIndex]?.caption}
    </p>
  </footer>
</div>
```
