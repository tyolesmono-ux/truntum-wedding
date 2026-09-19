# Feature Specification: Backend Security, Immutable Configuration & Database Foundation

**Feature Branch**: `001-backend-security`

**Created**: 2026-09-19

**Status**: Ready for Planning

**Input**: User description: "Fase 1: Keamanan, Konfigurasi Imutabel & Basis Data Backend" mengacu pada ROADMAP_PENGERJAAN.md

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tamu Mengirimkan Konfirmasi Kehadiran dan Ucapan Doa Restu (Priority: P1)

Sebagai tamu undangan pernikahan, saya ingin mengonfirmasi kehadiran saya (hadir/berhalangan), menentukan jumlah orang yang hadir (1-5 orang), dan mengirimkan pesan doa restu yang tulus kepada kedua mempelai, sehingga mempelai dapat mendata jumlah konsumsi dan menyematkan ucapan saya di buku tamu digital.

**Why this priority**: Ini adalah jalur interaksi utama pengguna dengan backend undangan. Tanpa kemampuan menyimpan RSVP dan doa restu secara andal dan cepat, fungsi buku tamu digital tidak dapat beroperasi.

**Independent Test**: Dapat diuji secara mandiri dengan mengirimkan data formulir valid (nama tamu, status kehadiran, jumlah tamu, doa restu, dan bukti verifikasi manusia). Sistem berhasil menyimpan entri, mencatat waktu kirim, dan mengembalikan konfirmasi sukses dalam waktu kurang dari 1 detik.

**Acceptance Scenarios**:

1. **Given** tamu membuka formulir RSVP dengan token verifikasi valid, **When** tamu mengisi nama "Bpk. Hendra", memilih "Hadir", pax 2 orang, dan pesan "Selamat menempuh hidup baru!", **Then** sistem menerima dan menyimpan konfirmasi kehadiran dengan aman, serta mengembalikan respons sukses.
2. **Given** tamu membuka formulir RSVP dengan token verifikasi valid, **When** tamu memilih "Berhalangan", pax 1 orang, dan pesan santun mendoakan dari jauh, **Then** sistem menyimpan status berhalangan dengan benar dan mengonfirmasi pengiriman.
3. **Given** tamu mengirimkan data tanpa mengisi nama atau dengan nama kurang dari 2 karakter, **When** formulir dikirimkan, **Then** sistem menolak pengiriman dan mengembalikan pesan validasi yang jelas dan santun.

---

### User Story 2 - Perlindungan Buku Tamu dari Tautan Jahat dan Skrip Berbahaya (Priority: P2)

Sebagai kedua mempelai dan keluarga besar, kami ingin memastikan buku tamu digital bersih dari tautan iklan, tautan phishing/judi online, dan skrip perusak (XSS), sehingga tamu-tamu terhormat lainnya aman saat membaca ucapan dan reputasi acara tetap terjaga mulia.

**Why this priority**: Undangan pernikahan disebarkan luas ke berbagai grup chat publik. Perlindungan dari spam tautan dan injeksi kode perusak adalah pilar keamanan kritis *zero-trust* sebelum data dipublikasikan.

**Independent Test**: Dapat diuji secara mandiri dengan mencoba mengirimkan pesan yang memuat tag HTML/skrip (`<script>`, `<img>`) atau format tautan web (`https://`, `www.`, `.com`, `bit.ly`). Sistem harus secara konsisten membersihkan tag kode atau menolak mentah-mentah pesan bertautan dengan pesan edukatif.

**Acceptance Scenarios**:

1. **Given** pengirim mencoba memasukkan pesan yang mengandung alamat web (misal: "Kunjungi https://example.com"), **When** formulir dikirimkan, **Then** sistem segera menolak pengiriman dengan status pesan tidak boleh memuat tautan luar.
2. **Given** pengirim memasukkan karakter pemformatan HTML (seperti `<b>Selamat</b>` atau tag script jahat), **When** formulir dikirimkan, **Then** sistem secara otomatis melucuti seluruh tag pemformatan kode dan hanya mempertahankan teks pesan murni yang aman.
3. **Given** pengirim mengirimkan lebih dari 3 pesan dalam rentang waktu 10 menit dari perangkat/jaringan yang sama, **When** pengiriman ke-4 dilakukan, **Then** sistem menolak pengiriman sementara dan meminta pengguna menunggu sejenak.

---

### User Story 3 - Perlindungan Mutlak Rekening Kado Finansial dari Manipulasi Data (Priority: P3)

Sebagai pengantin dan tamu undangan, kami ingin menjamin bahwa nomor rekening bank (BCA, Mandiri) dan kode QRIS kado pernikahan yang ditampilkan di situs web 100% otentik dan mustahil dimanipulasi oleh pihak ketiga melalui peretasan database, sehingga pemberian kado berlangsung aman tanpa risiko penipuan salah transfer.

**Why this priority**: Perlindungan finansial adalah komitmen non-negosiasi. Integritas rekening penerima harus terisolasi dari seluruh jalur mutasi database publik.

**Independent Test**: Dapat diuji dengan memverifikasi bahwa seluruh data nomor rekening dan gambar QRIS tidak memiliki tabel atau endpoint modifikasi apa pun di database, dan sepenuhnya dikunci sebagai konstanta sistem yang hanya bisa diubah melalui rilis kode resmi.

**Acceptance Scenarios**:

1. **Given** tamu mengakses informasi kado pernikahan, **When** sistem memuat data rekening dan QRIS, **Then** informasi disajikan langsung dari konfigurasi server yang terkunci tanpa membaca tabel database publik yang dapat disusupi.
2. **Given** pihak luar mencoba mengirimkan request mutasi untuk mengubah nomor rekening tujuan, **When** request diterima server, **Then** server menolak karena tidak ada endpoint mutasi yang disediakan.

---

### User Story 4 - Tombol Pemutus Darurat Formulir (Emergency Kill Switch) (Priority: P4)

Sebagai administrator pernikahan, saya ingin dapat menutup sementara penerimaan pesan buku tamu secara instan jika terjadi lonjakan serangan bot terkoordinasi, tanpa perlu merusak struktur database atau melakukan rollback sistem.

**Why this priority**: Menyediakan mekanisme mitigasi insiden operasional tercepat di perimeter gerbang server sebelum membebani penyimpanan data.

**Independent Test**: Dapat diuji dengan mengubah sakelar konfigurasi darurat menjadi non-aktif, lalu mengirimkan formulir ucapan. Sistem harus segera merespons bahwa penerimaan pesan sementara ditutup tanpa melakukan panggilan ke database.

**Acceptance Scenarios**:

1. **Given** sakelar darurat penerimaan formulir diset ke posisi non-aktif, **When** tamu atau bot mencoba mengirimkan ucapan, **Then** sistem langsung mengembalikan pesan pemberitahuan santun bahwa penerimaan ucapan sementara ditutup dan tidak ada catatan baru yang dimasukkan ke basis data.

---

### Edge Cases

- Apa yang terjadi jika tamu menggunakan nama yang sangat panjang (lebih dari 60 karakter)? Sistem menolak dengan batas validasi maksimal 60 karakter secara santun.
- Apa yang terjadi jika tamu mengirimkan pesan berisi spasi kosong saja? Sistem mendeteksi teks kosong setelah pembersihan spasi dan menolaknya.
- Apa yang terjadi jika verifikasi CAPTCHA gagal atau token kedaluwarsa? Sistem menolak pengiriman dan meminta tamu melakukan verifikasi ulang.
- Apa yang terjadi jika alamat IP pengirim tidak dapat dideteksi secara langsung dari header jaringan? Sistem menerapkan nilai default yang aman dan tetap memberlakukan kontrol keamanan.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistem HARUS menyediakan penyimpanan data konfirmasi kehadiran (RSVP) yang mencatat nama tamu, status kehadiran (hadir/berhalangan), jumlah orang (1–5), pesan doa restu (maksimal 500 karakter), dan stempel waktu pengiriman dalam format waktu standar UTC.
- **FR-002**: Sistem HARUS mengisolasi seluruh data rekening bank (nama bank, nama pemilik, nomor rekening) dan gambar QRIS sebagai konfigurasi server yang bersifat tetap (*read-only*) dan tidak dapat dimutasi melalui antarmuka web atau database publik.
- **FR-003**: Sistem HARUS menolak seluruh pengiriman pesan doa restu yang mengandung pola tautan URL, link web, atau domain (seperti `http://`, `https://`, `www.`, ekstensi domain, atau pemendek URL).
- **FR-004**: Sistem HARUS membersihkan dan melucuti seluruh elemen kode HTML, tag XML, skrip, dan atribut berbahaya dari teks pesan tamu sebelum disimpan ke basis data.
- **FR-005**: Sistem HARUS membatasi frekuensi pengiriman formulir maksimal 3 kali per 10 menit untuk setiap identitas perangkat pengirim guna mencegah banjir pesan (*spam flooding*).
- **FR-006**: Sistem HARUS mewajibkan dan memverifikasi token validasi bot (CAPTCHA) pada setiap pengiriman formulir sebelum memproses data.
- **FR-007**: Sistem HARUS menyamarkan identitas alamat jaringan (IP) pengirim menggunakan fungsi hash kriptografi satu arah yang diberi salt rahasia, sehingga alamat asli pengirim tidak pernah tersimpan secara terbuka.
- **FR-008**: Sistem HARUS memberlakukan kebijakan keamanan akses baris data (*Row Level Security*) di mana publik hanya diizinkan membaca pesan ucapan dan menambahkan ucapan baru, sedangkan pengubahan dan penghapusan ucapan diblokir mutlak untuk publik.
- **FR-009**: Sistem HARUS mendukung publikasi data real-time agar ucapan tamu yang baru saja disetujui dapat langsung disiarkan ke antarmuka buku tamu.
- **FR-010**: Sistem HARUS menyediakan tombol pemutus darurat (*emergency kill-switch*) untuk menghentikan penerimaan formulir seketika di gerbang server jika diperlukan.
- **FR-011**: Sistem HARUS menyertakan header keamanan HTTP yang ketat (kebijakan keamanan konten/CSP, anti-clickjacking, pelindung MIME-type, dan pemaksaan koneksi terenkripsi HTTPS).
- **FR-012**: Sistem HARUS mengembalikan respons terstandarisasi yang membedakan secara tegas antara operasi berhasil dan gagal dengan pesan kesalahan berbahasa Indonesia yang santun dan jelas.

### Key Entities *(include if feature involves data)*

- **Guest Attendance & Well-Wish Record (RSVP)**:
  * Entitas penyimpan konfirmasi kehadiran dan doa restu tamu.
  * Atribut utama: Pengenal unik (ID), nama tamu undangan, status kehadiran (hadir/berhalangan), jumlah tamu hadir (1–5), isi pesan doa restu (terbebas dari tautan dan skrip), hash identitas pengirim (anonim), dan waktu kirim.
- **Wedding Gift Configuration**:
  * Entitas informasi kado pernikahan digital yang bersifat tetap (*immutable*).
  * Atribut utama: Daftar rekening bank resmi (nama bank, nomor rekening, nama pemilik rekening) dan metadata aset digital QRIS resmi.
- **Security Boundary & Rate Bucket**:
  * Entitas pengawas ambang batas lalu lintas pengiriman data untuk mencegah penyalahgunaan otomatis dan menjamin ketersediaan layanan.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tamu undangan dapat menyelesaikan pengiriman konfirmasi kehadiran dan ucapan doa restu dalam waktu kurang dari 1,5 detik setelah menekan tombol kirim pada koneksi internet seluler standar.
- **SC-002**: Tingkat penolakan terhadap pesan uji yang mengandung tautan luar (phishing, spam, URL) dan injeksi skrip (XSS) mencapai 100% tanpa ada yang lolos ke penyimpanan data.
- **SC-003**: Sistem 100% tahan terhadap upaya modifikasi nomor rekening bank dari luar, dibuktikan dengan ketiadaan jalur mutasi data rekening di antarmuka publik.
- **SC-004**: Serangan pengiriman beruntun (*rapid submission*) lebih dari 3 kali dalam rentang 10 menit dari sumber yang sama berhasil diblokir secara otomatis 100%.
- **SC-005**: Pengujian otomatis (unit testing) mencakup seluruh skenario validasi, sanitasi, keamanan bot, pembatasan laju, dan hak akses data dengan tingkat kelulusan 100%.

## Assumptions

- Tamu undangan mengakses aplikasi melalui peramban web modern (iOS Safari, Android Chrome, atau browser desktop) yang mendukung JavaScript standar dan koneksi aman HTTPS.
- Layanan basis data dan infrastruktur komputasi awan yang digunakan (Supabase & Cloudflare) memiliki ketersediaan layanan (*uptime*) minimum 99,9%.
- Token verifikasi bot (Cloudflare Turnstile) dapat berjalan di lingkungan peramban seluler tanpa membebani tamu dengan teka-teki visual yang menyulitkan (*invisible challenge*).
- Data nomor rekening bank kedua mempelai telah final dan disepakati sebelum kode dirilis ke lingkungan produksi.
