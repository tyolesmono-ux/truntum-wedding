# Desain Arsitektur Teknis: Gerbang Pembuka (3D Virtual Envelope) & Audio Engine

**Tanggal**: 2026-09-19  
**Fase Roadmap**: Fase 2  
**Status**: Disetujui (Approved via `/grill-me` & `/brainstorming`)  
**Acuan SSoT**:
- [`docs/DOKUMEN_TEKNIS/DESIGN.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/DESIGN.md) (Bagian 4.1, 5.1, 6.1, 6.2, 7)
- [`docs/DOKUMEN_TEKNIS/PRD.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/PRD.md) (Bagian 2.2-A & B)
- [`.specify/memory/constitution.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/.specify/memory/constitution.md)

---

## 1. Topologi & Struktur Komponen

```
src/
├── app/
│   └── page.tsx                         # Server Component yang membaca searchParams (?to=...)
├── contexts/
│   └── AudioContext.tsx                 # AudioProvider & hook useAudio() (Web Audio API singleton)
├── components/
│   ├── opening/
│   │   ├── VirtualEnvelope.tsx          # Fullscreen 3D fixed overlay, scroll lock, unmount orchestrator
│   │   ├── WaxSeal.tsx                  # Stempel lilin monogram 72px, micro-crack, keyboard accessible
│   │   └── InvitationLetter.tsx         # Kartu surat meluncur keluar kantong (y: 0 -> -64px)
│   └── audio/
│       └── FloatingVinyl.tsx            # Piringan vinyl mengambang 52px, rotasi 12s, ring Prada permanen
└── lib/
    └── config/
        └── wedding-data.ts              # WEDDING_AUDIO_CONFIG imutabel
```

---

## 2. Web Audio API Engine & State Machine

### 2.1 Jalur Sinyal Audio
```
HTMLAudioElement (/audio/wedding-ambient.mp3)
      │
      ▼
MediaElementAudioSourceNode
      │
      ▼
GainNode (0.0001 -> 0.8 dalam 2.5s via linearRampToValueAtTime)
      │
      ▼
AudioContext.destination
```

### 2.2 Aturan Kebijakan Autoplay & Transisi
- **Gesture Unlock**: Inisialisasi dan pemanggilan `audioContext.resume()` dan `.play()` hanya terjadi saat gestur sentuh fisik pada `WaxSeal` atau tombol "Buka undangan".
- **Linear Volume Ramp**: Menggunakan Web Audio API `linearRampToValueAtTime` dari `0.0` ke `0.8` selama $2.5$ detik.
- **Micro-Fade (150ms)**: Pergantian toggle jeda/putar memodulasi volume turun ke 0 dalam 150ms sebelum pause untuk mencegah *audio clipping pop*.
- **Page Visibility (`visibilitychange`)**:
  - Tab tersembunyi (`hidden`): audio otomatis jeda, flag `wasPlayingBeforeHide = true`.
  - Tab kembali aktif (`visible`): jika `wasPlayingBeforeHide`, pemutaran otomatis dilanjutkan (*auto-resume*).

---

## 3. Desain 3D Virtual Envelope & Kronometri Gerak

### 3.1 Konstruksi Layering Z-Index
- Container: Layar penuh fixed `perspective: 1200px` dan `transform-style: preserve-3d`. Latar `#15120F` dengan vignette radial.
- Layer 0 (Backplate): Kertas Batik (`#E8DCC8`) $300 \times 200\text{ px}$.
- Layer 10 (Surat): Melati (`#FCFAF5`), meluncur naik `translateY: 0 -> -64px`.
- Layer 20 (Pocket): Kantong depan amplop penutup surat.
- Layer 30 (Top Flap): Lipatan atas amplop (`#DFD1B8`), `transform-origin: top`, rotasi `rotateX: 0 -> -180deg`.
- Layer 40 (Wax Seal): Lingkaran 72px Cinde (`#A63A30 → #6E241E`) + monogram Prada Emas (`#C2A05B`).

### 3.2 Kronometri Gerak (Motion Timing SSoT)
1. **Retak Segel**: 180ms easeOut (skala $1 \rightarrow 1.08 \rightarrow 0.96$).
2. **Flap Terbuka**: 700ms `[0.22, 1, 0.36, 1]` (`rotateX: 0 -> -180deg`).
3. **Surat Meluncur**: 620ms delay 280ms `[0.16, 1, 0.3, 1]` (`translateY: 0 -> -64px`).
4. **Fade-Out Overlay**: 500ms delay 760ms `easeInOut` (unmount via `AnimatePresence`).

### 3.3 Aksesibilitas & Reduced Motion
- `prefers-reduced-motion: reduce`: Urutan 3D diganti menjadi *cross-fade* 200ms langsung ke halaman utama.

---

## 4. Floating Vinyl Player

- Diameter 52px di sudut kanan bawah (`bottom: 20px`, `right: 20px`, `z-index: 40`).
- Latar Malam Wulung (`#231F1B`), 3 cincin alur piringan `rgba(217, 190, 133, 0.18)`, label tengah 18px Sogan Tua.
- Ring kontras Prada Emas `1px solid rgba(217, 190, 133, 0.35)` dan bayangan halus `box-shadow: 0 4px 16px rgba(0,0,0,0.35)` menjamin keterbacaan kontras di atas seksi terang maupun gelap tanpa observer DOM.
- Rotasi GPU 12s linear infinite. Saat jeda: `animation-play-state: paused` (mempertahankan sudut putar).
- Label aksesibilitas: `"Jeda musik"` / `"Putar musik"`.

---

## 5. Rencana Pengujian Otomatis

1. `tests/mocks/audio-mock.ts`: Mock terpusat untuk `AudioContext`, `GainNode`, `HTMLAudioElement`, dan simulator `visibilitychange`.
2. `tests/unit/audio-context.test.tsx`: Verifikasi autoplay compliance, linear volume ramp 2.5s, auto-pause background tab, auto-resume, dan micro-fade.
3. `tests/components/virtual-envelope.test.tsx`: Verifikasi nama tamu, fallback "Tamu Undangan", scroll locking, pemicu ganda, unmount, dan reduced motion.
4. `tests/components/wax-seal.test.tsx`: Verifikasi palet Cinde/Prada, aksesibilitas keyboard, dan micro-crack animation.
5. `tests/components/floating-vinyl.test.tsx`: Verifikasi ARIA attributes, rotasi running/paused, dan reduced motion.
