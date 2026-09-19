# Design System Specification: Bespoke Luxury Digital Wedding Invitation

- **Project**: Bespoke Luxury Digital Wedding Invitation
- **Companion to**: [`PRD.md`](./PRD.md) (2026-09-19)
- **Date**: 2026-09-19
- **Arah Visual**: Editorial high-fashion dengan fondasi warna & ornamen Surakarta
- **Target Utama**: Layar 390×844 (iPhone 12/13/14), scale-up ke desktop

---

## 1. Design Principles

1. **Satu keberanian saja.** Momen paling dramatis adalah pembukaan amplop. Setelah tamu masuk, halaman menjadi tenang: banyak ruang kosong, gerak minimal, tipografi yang bicara.
2. **Sogan sebagai tinta, bukan cat.** Warna Jawa hadir lewat teks, garis, dan ornamen tipis — bukan blok besar. Ini yang membedakan "muda dan modern" dari "klasik berat".
3. **Ornamen harus punya alasan.** Satu motif (kawung) dipakai konsisten sebagai tekstur latar, satu motif (truntum) sebagai pemisah. Tidak menambah motif ketiga.
4. **Ritme terang–gelap.** Halaman berselang antara gading dan wulung agar scroll panjang tidak terasa monoton dan galeri foto terasa sinematik.
5. **Gerak menjawab aksi.** Animasi dipakai untuk membuka, membuka besar, menyalin, dan mengonfirmasi. Tidak ada fade-up di setiap section.
6. **Terbaca dulu, indah kemudian.** Nomor rekening, waktu akad, dan alamat venue adalah informasi kritis: kontras tinggi, ukuran besar, tanpa ornamen di belakangnya.

---

## 2. Color System

### 2.1 Core Palette

| Nama | Hex | Asal | Peran |
| :--- | :--- | :--- | :--- |
| Gading keraton | `#F6F1E7` | Latar kain batik sogan Solo | Latar halaman utama |
| Kertas batik | `#E8DCC8` | Kain mentah | Permukaan amplop, border, divider |
| Melati | `#FCFAF5` | Bunga ronce | Kartu, modal, permukaan surat |
| Sogan muda | `#B07D4A` | Pewarna soga tegeran | Ikon, garis sekunder, hover |
| Sogan tua | `#6B4423` | Soga pekat | Warna brand, tombol utama, kaligrafi |
| Wulung | `#231F1B` | Dodot & blangkon | Heading, teks utama |

### 2.2 Accent

| Nama | Hex | Peran | Batas pemakaian |
| :--- | :--- | :--- | :--- |
| Prada emas | `#C2A05B` | Garis ornamen, wax seal, bingkai | Maks. 5% luas layar; **tidak untuk teks** |
| Prada terang | `#D9BE85` | Versi emas untuk latar gelap | Label & garis di section gelap |
| Cinde | `#8C2F27` | Segel lilin, state error, konfeti | Hanya elemen kecil |
| Gadung mlati | `#7E8C74` | State sukses, badge "Hadir" | Opsional |

### 2.3 Dark Surfaces

| Nama | Hex | Peran |
| :--- | :--- | :--- |
| Malam wulung | `#15120F` | Latar section galeri, love story, hero cover |
| Permukaan malam | `#221D18` | Kartu di atas latar gelap |
| Teks gading | `#EFE6D6` | Teks di latar gelap |

### 2.4 Semantic Tokens

```css
:root {
  /* surfaces */
  --bg:            #F6F1E7;
  --surface:       #FCFAF5;
  --surface-alt:   #E8DCC8;
  --bg-dark:       #15120F;
  --surface-dark:  #221D18;

  /* text */
  --fg:            #231F1B;
  --fg-body:       #4A3E33;
  --fg-muted:      #8A7862;
  --fg-on-dark:    #EFE6D6;
  --fg-muted-dark: #A2937C;

  /* brand & accent */
  --brand:         #6B4423;
  --brand-soft:    #B07D4A;
  --gold:          #C2A05B;
  --gold-light:    #D9BE85;
  --accent:        #8C2F27;
  --success:       #7E8C74;

  /* lines */
  --line:          #E0D3BC;
  --line-strong:   #C9B896;
  --line-dark:     rgba(217,190,133,0.22);
}
```

### 2.5 Aturan Kontras (WCAG)

| Kombinasi | Rasio | Status |
| :--- | :--- | :--- |
| Wulung `#231F1B` di gading | 14.8:1 | Aman untuk semua ukuran |
| Sogan tua `#6B4423` di gading | 7.6:1 | Aman untuk body text |
| Sogan muda `#B07D4A` di gading | 3.1:1 | Hanya teks ≥24px atau ikon |
| Prada `#C2A05B` di gading | 2.3:1 | **Dilarang untuk teks.** Garis & ornamen saja |
| Teks gading di malam wulung | 13.2:1 | Aman |
| Prada terang di malam wulung | 8.4:1 | Aman untuk label kecil |

Gradasi emas pada wax seal dan garis ornamen: `linear-gradient(135deg, #A8833C 0%, #E3CB8F 45%, #B9922F 100%)`.

---

## 3. Typography

### 3.1 Typefaces

| Peran | Typeface | Alasan | Weight yang dipakai |
| :--- | :--- | :--- | :--- |
| Display | **Bodoni Moda** (Google Fonts) | Didone bergaris tebal-tipis ekstrem — bahasa visual sampul majalah mode, sekaligus sejajar dengan ketajaman ukiran Surakarta | 400, 500 + italic 400 |
| Teks & UI | **Jost** (Google Fonts) | Geometris turunan Futura; huruf berbasis lingkaran-bujursangkar yang beresonansi dengan geometri kawung, dan terbaca bersih di layar kecil | 300, 400, 500 |
| Arab | **Amiri** (subset) | Naskh klasik berkualitas tinggi untuk Ar-Rum 21 | 400 |

Hanya tiga famili. Tidak ada font script/handwriting — itu tanda undangan generik.

### 3.2 Type Scale (mobile-first, rasio 1.25)

| Token | Ukuran | Line-height | Letter-spacing | Font | Penggunaan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-xl` | 56px / 72px* | 0.95 | -0.03em | Bodoni 400 | Nama pengantin di hero |
| `display-l` | 40px | 1.05 | -0.02em | Bodoni 400 | Judul section |
| `display-m` | 28px | 1.15 | -0.01em | Bodoni 400 | Nama mempelai, tanggal |
| `quote` | 22px | 1.6 | 0 | Bodoni italic 400 | Kutipan, terjemahan ayat |
| `arabic` | 30px | 2.1 | 0 | Amiri 400 | Teks Ar-Rum 21 |
| `body-l` | 17px | 1.75 | 0 | Jost 400 | Paragraf utama |
| `body` | 15px | 1.7 | 0 | Jost 400 | Teks umum, guestbook |
| `label` | 13px | 1.4 | 0.06em | Jost 500 | Label form, nama bank |
| `data` | 20px | 1.3 | 0.04em | Jost 500 | Nomor rekening, angka countdown |

\* 56px di mobile, 72px mulai breakpoint `md`.

### 3.3 Aturan Tipografi

- **Sentence case** untuk seluruh label dan tombol. Tidak ada ALL CAPS ter-tracking — termasuk pada eyebrow label.
- Tidak ada satu kata yang diberi warna/italic berbeda di tengah heading.
- Panjang baris maksimal 68 karakter; teks Bodoni boleh sampai 72.
- Nama pengantin di hero ditulis dengan Bodoni ukuran besar dan `letter-spacing: -0.03em` supaya menjadi elemen grafis, bukan sekadar teks.
- Bodoni memiliki hairline stroke: **minimum 22px**. Di bawah itu goresan tipisnya hilang di layar retina rendah — gunakan Jost.
- Font Arab wajib di-subset (Unicode range `U+0600-06FF, U+FE70-FEFF`) dan dimuat dengan `font-display: swap` + fallback metrics agar tidak menggeser layout.
- Angka countdown memakai `font-variant-numeric: tabular-nums` agar tidak bergoyang setiap detik.

---

## 4. Layout & Spacing

### 4.1 Grid

- Mobile: satu kolom, gutter 24px, lebar konten maksimal 480px.
- Desktop (`≥768px`): konten maksimal 720px, tetap terpusat — ini undangan, bukan dashboard.
- Section penuh gambar (hero, galeri) memakai full-bleed tanpa gutter.
- Alignment: **center** untuk hero, ayat suci, countdown, dan profil (mengikuti tradisi undangan formal). **Left-aligned** untuk love story, detail acara, dan guestbook agar terbaca cepat.

### 4.2 Spacing Scale

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128` (px)

- Padding vertikal antar section: 96px mobile, 128px desktop.
- Jarak judul section ke isi: 32px.
- Padding kartu: 24px.

### 4.3 Radius & Border

| Elemen | Radius |
| :--- | :--- |
| Tombol, input | 2px (hampir tegas — mengikuti bidang datar kain) |
| Kartu, modal | 4px |
| Foto galeri | 0 (full-bleed editorial) |
| Foto profil mempelai | Arch/ogee: `border-radius: 50% 50% 4px 4px / 32% 32% 4px 4px` |
| Vinyl player, avatar | 50% |

Border default: `1px solid var(--line)`. Ornamen prada: `1px solid var(--gold)` dengan opacity 0.5.

### 4.4 Wireframe Ringkas

```
GERBANG                          HALAMAN UTAMA
┌──────────────────┐             ┌──────────────────┐
│                  │             │  [foto cover]    │  gelap
│   Special        │             │                  │
│   invitation for │             │   ANANDA         │  Bodoni 56
│   Nama Tamu      │             │   &              │
│                  │             │   BAGUS          │
│  ┌────────────┐  │             │   12.12.2026     │  Jost 13
│  │  amplop    │  │             └──────────────────┘
│  │    (A&B)   │  │             ┌──────────────────┐
│  │   ◍ seal   │  │             │   ﴾ﺍﻟﺮﻭﻡ ٢١﴿      │  gading
│  └────────────┘  │             │  terjemahan…     │  + kawung 5%
│                  │             └──────────────────┘
│  Buka undangan   │             ┌──────────────────┐
└──────────────────┘             │ 12 : 04 : 33 : 09│  countdown
                                 └──────────────────┘
```

---

## 5. Ornamen Jawa

### 5.1 Aturan Umum

Satu motif tekstur + satu motif pemisah + satu siluet. Tidak lebih.

| Ornamen | Bentuk | Penempatan | Opacity |
| :--- | :--- | :--- | :--- |
| **Kawung** | Empat elips mengelilingi satu titik | Pola latar section gading (Ayat Suci, Countdown, Digital Gift) | 5% sogan tua |
| **Truntum** | Bunga kecil bertabur bintang | Ikon tengah pada divider horizontal | 100% prada, lebar 20px |
| **Gunungan** | Siluet runcing wayang | Bingkai atas section Ayat Suci dan frame countdown | Garis prada 1px |
| **Lung-lungan** | Sulur melengkung | Sudut amplop dan monogram wax seal | Garis prada 1px |

Kawung dipilih karena geometris dan bersih — motif Jawa yang paling ramah terhadap tata letak modern. Truntum dipilih karena maknanya: cinta yang tumbuh kembali, motif yang dikenakan orang tua pengantin dalam adat Solo.

### 5.2 Pola Kawung (SVG tile)

```html
<svg width="0" height="0" aria-hidden="true">
  <defs>
    <pattern id="kawung" width="64" height="64" patternUnits="userSpaceOnUse">
      <g fill="none" stroke="#6B4423" stroke-width="1" opacity="0.05">
        <ellipse cx="32" cy="16" rx="13" ry="15"/>
        <ellipse cx="32" cy="48" rx="13" ry="15"/>
        <ellipse cx="16" cy="32" rx="15" ry="13"/>
        <ellipse cx="48" cy="32" rx="15" ry="13"/>
        <circle cx="32" cy="32" r="2.5" fill="#6B4423" stroke="none"/>
      </g>
    </pattern>
  </defs>
</svg>
```

Dipakai sebagai `<rect fill="url(#kawung)">` di layer paling belakang section, dengan mask radial agar memudar ke tepi: `mask-image: radial-gradient(ellipse at center, #000 30%, transparent 78%)`.

### 5.3 Divider Truntum

```
──────────────  ✦  ──────────────
```

Garis 1px `var(--line-strong)`, panjang 72px di tiap sisi, ikon truntum SVG 20px berwarna prada di tengah. Dipakai untuk memisahkan sub-bagian dalam satu section, bukan antar section.

---

## 6. Component Specification

### 6.1 Opening Gate — Virtual Envelope

| Properti | Nilai |
| :--- | :--- |
| Latar layar | `#15120F` dengan vignette radial |
| Badan amplop | `#E8DCC8`, tekstur kertas noise 3%, ukuran 300×200px |
| Flap | `#DFD1B8` (2 langkah lebih gelap), `transform-origin: top` |
| Bayangan | `0 24px 48px rgba(0,0,0,0.45)` |
| Ornamen | Lung-lungan prada 1px di keempat sudut |
| Wax seal | Lingkaran 72px, gradasi cinde `#A63A30 → #6E241E`, monogram prada di tengah, `box-shadow: 0 4px 10px rgba(0,0,0,.4)` |
| Teks | "Kepada Bapak/Ibu/Saudara" (Jost 13, `--fg-muted-dark`) + nama tamu (Bodoni 28, `--fg-on-dark`) |
| Aksesibilitas | Wax seal adalah `<button>` dengan `aria-label="Buka undangan"`, focus ring prada 2px offset 4px |

Copy tombol: **"Buka undangan"** — bukan "Open Invitation" atau "Klik di sini".

### 6.2 Floating Vinyl Player

- Diameter 52px, posisi `fixed` kanan-bawah, offset 20px, `z-index: 40`.
- Piringan: `#231F1B` dengan tiga cincin `rgba(217,190,133,0.18)`, label tengah 18px berwarna sogan tua + inisial prada.
- Rotasi `12s linear infinite`; `animation-play-state: paused` saat jeda — bukan berhenti lalu mengulang dari 0.
- Saat section gelap aktif, tepi piringan diberi ring `1px rgba(217,190,133,0.3)` agar tidak lebur.
- `aria-label` bergantian: "Jeda musik" / "Putar musik".
- Hormati `prefers-reduced-motion`: rotasi dimatikan, status ditunjukkan lewat ikon play/pause.

### 6.3 Tombol

| Varian | Latar | Teks | Border | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| Primary | `--brand` | `#FCFAF5` | — | Kirim RSVP, buka undangan |
| Secondary | transparan | `--brand` | 1px `--line-strong` | Salin rekening, tambah ke kalender |
| Ghost dark | transparan | `--fg-on-dark` | 1px `--line-dark` | Tombol di section gelap |

Tinggi 48px, padding horizontal 24px, Jost 500 15px. Tidak ada panah "→" pada label. Nama aksi konsisten dari tombol ke notifikasi: tombol "Salin nomor rekening" → toast "Nomor rekening tersalin".

### 6.4 Form RSVP

- Input bergaya garis bawah: transparan, `border-bottom: 1px solid var(--line-strong)`, tanpa border lain. Fokus menebalkan garis menjadi `--brand` dan memunculkan label kecil di atas.
- Font input 16px (mencegah zoom otomatis iOS Safari).
- Pilihan kehadiran: dua pill lebar penuh, terpilih = `--brand` isi penuh; berhalangan terpilih = `--fg-muted` outline.
- Pesan error: teks 13px `--accent` di bawah field, kalimat aktif dan spesifik — "Nama maksimal 60 karakter", bukan "Input tidak valid". Pesan penolakan link: "Pesan tidak boleh memuat tautan."
- Counter karakter muncul setelah 400/500 karakter, bukan sejak awal.

### 6.5 Digital Gift

- Kartu rekening: latar `--surface`, border 1px `--line`, radius 4px, **tanpa pola kawung di belakangnya** agar nomor terbaca maksimal.
- Nomor rekening: token `data` (Jost 500, 20px, tabular-nums), dipecah per empat digit dengan spasi tipis.
- Toast konfirmasi salin muncul 2 detik di atas kartu, latar `--fg`, teks `--surface`.
- QRIS ditampilkan di modal dengan latar putih murni `#FFFFFF` (bukan gading) — latar berwarna menurunkan keberhasilan pemindaian.
- Di bawah kartu: satu baris `--fg-muted` 13px, "Nomor rekening hanya yang tercantum di halaman ini."

### 6.6 Guestbook

- Setiap ucapan: nama (Jost 500 15px), badge kehadiran kecil, pesan (Jost 400 15px, `--fg-body`), waktu relatif (`--fg-muted` 12px).
- Pemisah antar ucapan: garis 1px `--line`, bukan kartu bertumpuk. Daftar kartu identik adalah tanda desain template.
- Ucapan baru dari realtime masuk dengan tinggi ter-animasi (`height: 0 → auto`, 240ms) — gerak yang menjelaskan perubahan, bukan dekorasi.
- Empty state: "Jadilah yang pertama mengirim doa untuk Ananda & Bagus."

---

## 7. Motion

| Momen | Durasi | Easing | Catatan |
| :--- | :--- | :--- | :--- |
| Retak segel | 180ms | `easeOut` | Skala 1 → 1.08 → 0.96, opacity turun |
| Flap terbuka | 700ms | `[0.22, 1, 0.36, 1]` | `rotateX: 0 → -180deg`, perspective 1200px |
| Surat meluncur | 620ms, delay 280ms | `[0.16, 1, 0.3, 1]` | `y: 0 → -64px`, opacity naik |
| Amplop memudar | 500ms, delay 760ms | `easeInOut` | Sekaligus memicu `audio.fade-in` |
| Hero masuk | 900ms | `easeOut` | Hanya nama pengantin & tanggal, stagger 90ms |
| Reveal section | 500ms | `easeOut` | **Hanya** Ayat Suci dan Love Story. Section lain tampil tanpa animasi |
| Lightbox buka | 320ms | `easeOut` | Skala dari posisi thumbnail |
| Konfeti | 1.8s | — | Warna `#C2A05B`, `#8C2F27`, `#F6F1E7`, `#6B4423` |

Konfigurasi Lenis: `lerp: 0.085`, `wheelMultiplier: 1`, `touchMultiplier: 1.6`, dinonaktifkan saat modal terbuka.

Seluruh animasi non-esensial dimatikan saat `prefers-reduced-motion: reduce`. Urutan amplop tetap dijalankan tetapi disederhanakan menjadi cross-fade 200ms, karena ia adalah alur navigasi, bukan dekorasi.

---

## 8. Ritme Section

| # | Section | Latar | Ornamen | Alignment |
| :--- | :--- | :--- | :--- | :--- |
| 0 | Opening gate | Malam wulung | Lung-lungan + wax seal | Center |
| 1 | Hero | Foto full-bleed + overlay `rgba(21,18,15,0.45)` | — | Center |
| 2 | Ayat suci & doa | Gading | Kawung 5% + gunungan | Center |
| 3 | Profil mempelai | Melati | Divider truntum | Center |
| 4 | Countdown | Gading | Frame gunungan prada | Center |
| 5 | Rangkaian acara | Melati | Divider truntum antar acara | Left |
| 6 | Love story | Malam wulung | Garis vertikal prada | Left |
| 7 | Galeri | Malam wulung | — | Full-bleed |
| 8 | Digital gift | Gading | Kawung 5% (di luar kartu) | Center |
| 9 | RSVP & guestbook | Melati | — | Left |
| 10 | Penutup | Malam wulung | Monogram prada | Center |

Pola terang–gelap: `gelap → gelap → terang → terang → terang → terang → gelap → gelap → terang → terang → gelap`. Perpindahan ke section gelap diberi transisi warna latar 400ms saat batas section melewati 60% viewport.

---

## 9. Implementasi

### 9.1 Tailwind Theme

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      bg: '#F6F1E7',
      surface: { DEFAULT: '#FCFAF5', alt: '#E8DCC8', dark: '#221D18' },
      ink: { DEFAULT: '#231F1B', body: '#4A3E33', muted: '#8A7862', light: '#EFE6D6' },
      sogan: { DEFAULT: '#6B4423', soft: '#B07D4A' },
      prada: { DEFAULT: '#C2A05B', light: '#D9BE85' },
      cinde: '#8C2F27',
      gadung: '#7E8C74',
      night: '#15120F',
      line: { DEFAULT: '#E0D3BC', strong: '#C9B896' },
    },
    fontFamily: {
      display: ['var(--font-bodoni)', 'Georgia', 'serif'],
      sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
      arabic: ['var(--font-amiri)', 'serif'],
    },
    borderRadius: { DEFAULT: '2px', card: '4px' },
    transitionTimingFunction: { luxe: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  },
}
```

### 9.2 Pemuatan Font

Ketiga font dimuat via `next/font/google` dengan `display: 'swap'` dan subset eksplisit. Amiri memakai `subsets: ['arabic']`. Bodoni Moda dibatasi pada weight 400 + italic 400 untuk menjaga budget bundle. Total anggaran font: ≤ 120 KB.

### 9.3 Aset Gambar

- Foto galeri: AVIF dengan fallback WebP, lebar 1200px, quality 72, ≤150 KB.
- Foto profil mempelai dan cover hero diberi grading warna hangat konsisten (temperature +6, saturation -8) agar menyatu dengan palet sogan.
- Placeholder: `blurDataURL` warna `#E8DCC8`, bukan abu-abu.

### 9.4 Quality Floor

- Seluruh elemen interaktif punya focus ring terlihat: `outline: 2px solid #C2A05B; outline-offset: 3px`.
- Target sentuh minimal 44×44px.
- Hierarki heading benar (`h1` hanya di hero) dan section memakai `<section aria-labelledby>`.
- Kontras minimum 4.5:1 untuk seluruh teks di bawah 24px.
- Teks Arab memakai `dir="rtl"` dan `lang="ar"`; terjemahan `lang="id"`.
- Diuji pada iPhone 11 / Galaxy A52 dalam mode hemat daya dan pada lebar 320px.

---

## 10. Yang Sengaja Dihindari

- Gradien latar mesh, glassmorphism, dan bayangan lembut seragam di setiap kartu.
- Eyebrow label huruf kapital ter-tracking di atas setiap judul.
- Penomoran 01 / 02 / 03 — kecuali pada Love Story, karena di sana urutan memang bermakna.
- Font script atau kaligrafi latin untuk nama pengantin.
- Motif batik berwarna penuh sebagai latar section — terlalu ramai di layar kecil dan membebani ukuran aset.
- Animasi fade-up di setiap section dan efek hover di setiap kartu.
