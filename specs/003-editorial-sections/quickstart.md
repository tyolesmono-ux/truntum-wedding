# Quickstart & Verification Guide: Seksi Halaman Utama & Narasi Editorial (Fase 3A)

**Feature**: `003-editorial-sections`  
**Date**: 2026-09-19  

Panduan ini berisi langkah-langkah verifikasi cepat untuk menguji implementasi Seksi Halaman Utama & Narasi Editorial (Fase 3A) secara menyeluruh.

---

## 1. Prasyarat Pengujian

1. Node.js `≥20.x` dan pnpm `≥9.x` terpasang.
2. Dependensi proyek terinstal lengkap:
   ```bash
   pnpm install
   ```

---

## 2. Pengujian Otomatis (Automated Unit Tests)

Sesuai Konstitusi Pasal V dan CODING_STANDARD.md, seluruh komponen baru wajib memiliki unit test pendamping:

```bash
# Menjalankan seluruh pengujian unit seksi editorial Fase 3A
pnpm test src/components/sections/
pnpm test src/components/layout/SmoothScrollProvider.test.tsx
pnpm test src/hooks/useCountdown.test.ts
```

### Kriteria Kelulusan Otomatis:
- 100% tes unit lulus tanpa kegagalan.
- `pnpm typecheck` keluar dengan 0 error TypeScript.
- `pnpm lint` keluar dengan 0 peringatan/error ESLint.

---

## 3. Skenario Uji Manual & Visual (Browser Verification)

Jalankan server pengembangan:
```bash
pnpm dev
```
Buka browser di `http://localhost:3000?to=Budi+Sekeluarga`.

### Skenario 1: Gerbang Pembuka & Lenis Scroll Lock
1. **Langkah**: Jangan klik wax seal amplop terlebih dahulu. Coba lakukan scroll roda mouse atau usap layar ponsel.
2. **Ekspektasi**: Halaman tetap terkunci pada amplop 3D (tidak dapat digulir ke bawah).
3. **Langkah Lanjutan**: Klik wax seal merah Cinde. Amplop terbuka, surat meluncur, audio fade-in dimulai.
4. **Ekspektasi**: Halaman utama terbuka dan scroll langsung aktif secara mulus.

### Skenario 2: Hero Section & Transisi Warna Latar
1. **Langkah**: Amati sampul Hero berlayar penuh (`min-h-screen`).
2. **Ekspektasi**: Foto sinematik potret tampil megah dengan nama mempelai berukuran besar (*Bodoni Moda*) kontras tinggi.
3. **Langkah Lanjutan**: Gulir perlahan ke bawah menuju seksi Ayat Suci.
4. **Ekspektasi**: Gradasi gelap malam wulung memudar lembut ke warna gading keraton dengan ornamen Kawung 5%.

### Skenario 3: Seksi Ayat Suci & Kaligrafi Arab
1. **Langkah**: Periksa tampilan Surat Ar-Rum: 21.
2. **Ekspektasi**: Teks Arab font Amiri tampil tajam dengan harakat lengkap, orientasi kanan-ke-kiri (*RTL*), diiringi terjemahan puitis bahasa Indonesia dan doa sunnah pernikahan.
3. **Aksesibilitas**: Inspect element pada teks Arab memastikan tag memiliki atribut `dir="rtl"` dan `lang="ar"`.

### Skenario 4: Profil Mempelai & Responsivitas
1. **Langkah**: Buka Developer Tools, alihkan ke mode seluler (iPhone 12/13/14, 390×844).
2. **Ekspektasi**: Profil pria dan wanita tersusun vertikal dengan pemisah Truntum dan ampersand di tengah. Foto memiliki lengkung kubah ogee khas keraton.
3. **Langkah Lanjutan**: Alihkan ke layar desktop (`≥768px`).
4. **Ekspektasi**: Profil otomatis berpindah menjadi 2 kolom berdampingan (*editorial spread*) terpusat.

### Skenario 5: Countdown Reaktif & Tabular Numbers
1. **Langkah**: Amati timer 4 kolom (Hari, Jam, Menit, Detik).
2. **Ekspektasi**: Detik berkurang stabil setiap 1.000 ms tanpa getaran atau pergeseran lebar kotak teks (*tabular nums*). Pemisah titik dua berkedip/berdenyut halus.

### Skenario 6: Integrasi Jadwal Acara, Kalender & Navigasi Peta
1. **Langkah**: Pada kartu Akad Nikah, klik tombol "Tambah ke kalender".
2. **Ekspektasi**: Muncul popover/menu pilihan Google Calendar dan Apple / iCal.
   - Klik Google Calendar $\rightarrow$ Tab baru terbuka dengan judul, tanggal, dan lokasi Akad Nikah terisi otomatis.
   - Klik Apple / iCal $\rightarrow$ Berkas `.ics` terunduh instan ke komputer/ponsel.
3. **Langkah**: Klik tombol "Buka peta venue".
4. **Ekspektasi**: Tautan Google Maps membuka koordinat gedung resmi di tab baru.
