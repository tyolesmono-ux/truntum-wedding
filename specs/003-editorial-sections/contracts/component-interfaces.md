# Interface Contract: Komponen UI Editorial & Layout (Fase 3A)

**Feature**: `003-editorial-sections`  
**Standard Reference**: Single Source of Truth [`DESIGN.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/DESIGN.md)  

---

## 1. `SmoothScrollProvider`
Wrapper klien untuk inisialisasi dan orkestrasi Lenis smooth scrolling.

```typescript
export interface SmoothScrollProviderProps {
  readonly children: React.ReactNode;
  readonly isLocked?: boolean; // Mengunci scroll saat amplop belum dibuka
}
```

---

## 2. `HeroSection`
Seksi sampul majalah editorial berlayar penuh dengan nama mempelai bergaya Didone.

```typescript
export interface HeroSectionProps {
  readonly groomName: string;
  readonly brideName: string;
  readonly weddingDateText: string;
  readonly locationText: string;
  readonly coverImageUrl: string;
}
```

---

## 3. `IslamicQuotes`
Seksi ayat suci Al-Qur'an (Surat Ar-Rum: 21) dan doa berkah pernikahan.

```typescript
export interface IslamicQuotesProps {
  readonly arabicText: string;
  readonly translation: string;
  readonly surahReference: string;
  readonly blessingDuah: string;
}
```

---

## 4. `CoupleProfile`
Kartu profil kedua mempelai dengan bingkai kubah keraton dan silsilah keluarga.

```typescript
import { WeddingPerson } from '@/lib/config/wedding-content';

export interface CoupleProfileProps {
  readonly groom: WeddingPerson;
  readonly bride: WeddingPerson;
}
```

---

## 5. `CountdownSection`
Penghitung waktu mundur reaktif berbasis angka tabular berbingkai Gunungan Prada Emas.

```typescript
export interface CountdownSectionProps {
  readonly targetDate: string; // ISO 8601 string
  readonly ceremonyTitle?: string;
}
```

---

## 6. `EventDetails`
Daftar rincian sesi acara (Akad Nikah & Resepsi) dengan integrasi kalender dan peta.

```typescript
import { WeddingEventSession } from '@/lib/config/wedding-content';

export interface EventDetailsProps {
  readonly events: readonly WeddingEventSession[];
}
```
