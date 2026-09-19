# Quickstart: Skenario Validasi Fitur Fase 2

**Fitur**: `002-virtual-envelope-audio`  
**Tujuan**: Panduan pengujian langsung (*runnable verification*) untuk membuktikan bahwa subsistem Gerbang Pembuka 3D dan Audio Engine berfungsi secara *end-to-end* sesuai spesifikasi.

---

## 1. Prasyarat Pengujian

Pastikan dependensi proyek terpasang dan server pengembangan siap dijalankan:
```bash
pnpm install
```

Berkas audio ambient pengujian tersedia pada path:
`public/audio/wedding-ambient.mp3`

---

## 2. Pengujian Otomatis Unit (Vitest)

Jalankan rangkaian tes unit otomatis untuk memverifikasi Web Audio API, komponen amplop 3D, segel lilin, dan pemutar vinyl:

```bash
pnpm test
```

### Skenario Uji Otomatis Utama:
1. **Autoplay Compliance Test (`tests/unit/audio-context.test.tsx`)**:
   - Memastikan `AudioContext` tidak memanggil `.resume()` atau `.play()` saat mount pertama.
   - Memastikan `unlockAndPlay()` hanya berjalan saat gestur klik dan memanggil `linearRampToValueAtTime(0.8, currentTime + 2.5)`.
2. **Page Visibility Test (`tests/unit/audio-context.test.tsx`)**:
   - Mensimulasikan `document.visibilityState = 'hidden'` $\rightarrow$ audio otomatis terjeda.
   - Mensimulasikan `document.visibilityState = 'visible'` $\rightarrow$ audio otomatis melanjutkan pemutaran (*auto-resume*).
3. **Amplop 3D & Personalisasi (`tests/components/virtual-envelope.test.tsx`)**:
   - Memeriksa nama tamu ter-render dengan benar dari parameter `?to=`.
   - Menguji fallback *"Tamu Undangan"* bila parameter kosong.
   - Memverifikasi `document.body.style.overflow` terkunci saat amplop muncul dan pulih setelah unmount.
4. **Floating Vinyl Player (`tests/components/floating-vinyl.test.tsx`)**:
   - Memeriksa rotasi GPU kontinu saat `isPlaying === true` dan jeda rotasi saat `paused`.
   - Memverifikasi penonaktifan rotasi pada mode `prefers-reduced-motion`.

---

## 3. Verifikasi Manual di Browser (End-to-End)

Jalankan server dev:
```bash
pnpm dev
```

Buka URL pengujian di peramban: `http://localhost:3000/?to=Bapak+Joko+Sekeluarga`

### Langkah-langkah Pengujian Alur Pengguna:
1. **Tampilan Amplop Layar Penuh**:
   - Periksa layar berlatar Malam Wulung gelap dengan vignette.
   - Pastikan teks *"Kepada Bapak/Ibu/Saudara"* dan nama *"Bapak Joko Sekeluarga"* muncul dengan elegan.
   - Coba scroll mouse / touch scroll $\rightarrow$ halaman utama di belakang amplop tidak boleh tergulir.
2. **Ketuk Segel Lilin / Tombol "Buka undangan"**:
   - Ketuk stempel segel lilin $\rightarrow$ amati efek retak mikro (180ms).
   - Lipatan atas amplop (flap) berotasi naik $180^\circ$ secara realistis (700ms).
   - Kartu surat meluncur naik dari kantong (620ms).
   - Layar memudar halus (500ms), overlay unmount, dan scroll halaman utama terbuka.
3. **Pemeriksaan Audio Engine**:
   - Pastikan alunan musik latar mengalun pelan dan volumenya meningkat halus selama 2.5 detik tanpa hentakan suara kaget.
   - Lihat di sudut kanan bawah: `FloatingVinyl` berputar mulus (12 detik per putaran).
4. **Interaksi Piringan Vinyl**:
   - Klik piringan vinyl $\rightarrow$ musik mereda halus (150ms) dan piringan berhenti pada sudut posisinya.
   - Klik kembali $\rightarrow$ musik berlanjut dan piringan kembali berputar.
5. **Uji Latar Belakang Tab**:
   - Buka tab browser baru (meninggalkan tab undangan) $\rightarrow$ pastikan suara musik otomatis berhenti.
   - Kembali ke tab undangan $\rightarrow$ pastikan suara musik otomatis melanjutkan pemutaran.
