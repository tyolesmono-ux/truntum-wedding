# Feature Specification: 004-digital-gift-guestbook
## Hadiah Digital & Buku Tamu Realtime (Digital Gift, RSVP & Live Guestbook)

**Feature Branch**: `004-digital-gift-guestbook`  
**Created**: 2026-09-20  
**Status**: Draft  
**Input**: User description: "Fase 4: Hadiah Digital & Buku Tamu Realtime mengacu pada ROADMAP_PENGERJAAN.md"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mengirimkan Konfirmasi Kehadiran & Doa Restu (Priority: P1)
Sebagai tamu undangan, saya ingin dapat mengonfirmasi kehadiran (Hadir atau Berhalangan), menentukan jumlah tamu yang hadir (jika hadir), dan mengirimkan doa restu yang santun secara langsung dari ponsel saya, sehingga kedua mempelai dapat mengetahui kepastian kehadiran serta menerima doa berkah saya.

**Why this priority**:
Merupakan inti interaksi timbal balik tamu dalam undangan digital (RSVP). Tanpa fitur ini, tamu tidak dapat mengonfirmasi kehadiran atau berinteraksi secara personal dengan pengantin.

**Independent Test**:
Dapat diuji secara independen dengan mengisi formulir RSVP (nama tamu, status kehadiran, dan doa restu), memverifikasi captcha/turnstile, lalu mengirimkan formulir. Sistem memvalidasi input, menyimpan ke basis data, memicu selebrasi konfeti, dan menampilkan kartu konfirmasi terima kasih santun.

**Acceptance Scenarios**:
1. **Given** tamu membuka formulir RSVP dengan tautan personalisasi `?to=Bpk.+Hendra`, **When** halaman dimuat, **Then** bidang nama tamu telah terisi otomatis dengan "Bpk. Hendra".
2. **Given** tamu memilih opsi "Hadir", **When** tamu melihat formulir, **Then** selektor jumlah tamu (1–5 orang) ditampilkan untuk dipilih.
3. **Given** tamu memilih opsi "Berhalangan", **When** status dipilih, **Then** bidang jumlah tamu disembunyikan secara halus dan nilai kehadiran diset secara internal tanpa membingungkan tamu.
4. **Given** tamu mengetikkan doa restu tanpa tautan, **When** tombol "Kirim konfirmasi & doa" ditekan dan validasi bot terpenuhi, **Then** sistem menampilkan kartu konfirmasi terima kasih ("Matur nuwun sanget atas konfirmasi dan doa restu panjenengan"), meluncurkan efek konfeti palet Surakarta, serta menyediakan opsi "Kirim ucapan tambahan".
5. **Given** tamu sengaja atau tidak sengaja mengetikkan teks yang memuat tautan/URL (e.g. `https://`, `www.`, atau `.com`), **When** teks diketikkan, **Then** sistem secara proaktif memunculkan peringatan spesifik ("Pesan tidak boleh memuat tautan.") dan menonaktifkan pengiriman.

---

### User Story 2 - Menyaksikan Doa Restu Mengalir Secara Realtime (Priority: P2)
Sebagai tamu undangan atau mempelai yang sedang membuka website, saya ingin melihat ucapan doa restu dari para tamu lain tersaji secara instan dan mengalir secara langsung (*realtime*) tanpa perlu memuat ulang halaman (*reload*), sehingga tercipta suasana kebersamaan dan kehangatan pesta pernikahan.

**Why this priority**:
Menghidupkan suasana digital pernikahan (*social proof* & kehangatan kekeluargaan) dengan pembaruan instan berbasis WebSocket tanpa latensi reload.

**Independent Test**:
Dapat diuji secara independen dengan membuka dua peramban/jendela berbeda; saat jendela A mengirimkan doa, jendela B langsung menampilkan doa baru tersebut di posisi paling atas dengan animasi halus 240ms dan pemisah garis 1px.

**Acceptance Scenarios**:
1. **Given** tamu menggulir ke seksi Dinding Buku Tamu, **When** halaman pertama kali dibuka, **Then** sistem langsung menyajikan hingga 20 doa restu terbaru hasil pemuatan server (SSR) tanpa penundaan atau pergeseran tata letak (CLS = 0).
2. **Given** terdapat doa restu baru yang berhasil dikirimkan, **When** data disiarkan oleh sistem, **Then** seluruh peramban yang aktif langsung menampilkan ucapan tersebut di urutan teratas dengan animasi ketinggian (`height: 0 -> auto`, 240ms).
3. **Given** tamu yang baru saja mengirimkan doa, **When** pengiriman berhasil di peramban lokal, **Then** ucapannya langsung tampil seketika di posisi teratas tanpa menunggu kedatangan pesan siaran jaringan (*optimistic update* dengan deduplikasi ID).
4. **Given** daftar doa memiliki lebih dari 20 entri historis, **When** tamu menekan tombol "Tampilkan doa terdahulu", **Then** sistem memuat batch doa berikutnya secara berurutan.
5. **Given** belum ada doa yang tersimpan sama sekali, **When** seksi dibuka, **Then** sistem menampilkan teks santun "Jadilah yang pertama mengirim doa untuk Ananda & Bagus."

---

### User Story 3 - Mengirimkan Tanda Kasih Finansial & Memindai QRIS (Priority: P3)
Sebagai tamu undangan yang berhalangan hadir atau ingin memberikan hadiah pernikahan secara cashless, saya ingin melihat nomor rekening resmi kedua mempelai yang mudah disalin dengan satu sentuhan serta kode QRIS berlatar putih bersih yang dapat dipindai dengan akurat oleh kamera ponsel saya.

**Why this priority**:
Memberikan fasilitas penyampaian kado pernikahan yang aman, nyaman, dan bebas dari risiko penipuan/manipulasi rekening.

**Independent Test**:
Dapat diuji secara independen dengan mengklik tombol "Salin nomor rekening" untuk memverifikasi papan klip (*clipboard*) dan toast konfirmasi 2 detik, serta mengklik tombol "Lihat kode QRIS" untuk memastikan modal terbuka dengan latar belakang putih murni `#FFFFFF` dan scroll halaman terkunci.

**Acceptance Scenarios**:
1. **Given** tamu berada di seksi Kado Finansial, **When** tamu melihat kartu bank BCA dan Bank Mandiri, **Then** nomor rekening tersaji dengan pemisahan spasi 4 digit yang mudah dibaca dan bebas dari pola tekstur latar yang mengganggu.
2. **Given** tamu menekan tombol "Salin nomor rekening", **When** tombol ditekan, **Then** nomor rekening tersalin ke clipboard dan notifikasi mikro bertuliskan "Nomor rekening tersalin" muncul selama 2 detik.
3. **Given** tamu ingin memberikan hadiah via QRIS/e-wallet, **When** tamu menekan tombol "Lihat kode QRIS", **Then** jendela modal muncul dengan latar belakang putih murni `#FFFFFF`, menampilkan kode QR resmi ber-NMID jelas, dan pengguliran halaman latar dinonaktifkan sementara.
4. **Given** modal QRIS sedang terbuka, **When** tamu menekan tombol Escape, tombol silang, atau area luar modal, **Then** modal tertutup seketika dan pengguliran halaman normal kembali.
5. **Given** tamu membaca seksi kado, **When** melihat ke bagian bawah kartu, **Then** tertera kalimat disclaimer resmi: "Nomor rekening hanya yang tercantum di halaman ini."

---

### User Story 4 - Menikmati Penutup Undangan yang Anggun & Khidmat (Priority: P4)
Sebagai tamu undangan yang telah selesai membaca seluruh rangkaian undangan dan mengirimkan ucapan, saya ingin melihat seksi penutup bernuansa khidmat yang menyampaikan rasa terima kasih dan salam hormat dari kedua keluarga mempelai.

**Why this priority**:
Menyelesaikan alur membaca undangan (*editorial journey*) dengan ritme visual gelap yang tenang (*Malam Wulung*) dan kesantunan adat Surakarta.

**Independent Test**:
Dapat diuji dengan menggulir hingga ke ujung halaman utama untuk memastikan seksi penutup berlatar Malam Wulung `#15120F` tampil dengan tipografi Bodoni Moda & Jost, monogram inisial mempelai beraksen Prada Emas, serta salam keluarga besar.

**Acceptance Scenarios**:
1. **Given** tamu menggulir melewati seksi buku tamu, **When** mencapai seksi penutup, **Then** latar belakang berubah anggun menjadi Malam Wulung (`#15120F`) dengan kontras teks gading terang yang memenuhi standar WCAG AA ($\ge 4.5:1$).
2. **Given** seksi penutup terlihat, **When** tamu membaca konten, **Then** tersaji salam santun "Wassalamu’alaikum Warahmatullahi Wabarakatuh", ungkapan terima kasih mendalam, inisial monogram Prada Emas, dan nama kedua keluarga besar mempelai.

---

### Edge Cases
- **Koneksi Jaringan Terputus saat Submit RSVP**: Sistem menangani kegagalan jaringan secara anggun, menampilkan pesan error yang ramah ("Terjadi kendala koneksi. Silakan coba beberapa saat lagi."), dan mempertahankan isi formulir agar tamu tidak perlu mengetik ulang dari awal.
- **Upaya Flooding Pengiriman (Spam)**: Jika sebuah alamat IP mengirimkan form lebih dari 3 kali dalam rentang 10 menit, sistem memblokir sementara pengiriman dengan pesan penjelas bahwa batas frekuensi telah tercapai.
- **Injeksi Kode Berbahaya (Stored XSS / HTML Tag)**: Jika tamu mencoba mengirimkan tag `<script>`, `<iframe>`, atau atribut `onerror=`, sistem membersihkan seluruh markup sebelum disimpan dan merender pesan murni sebagai teks string React tanpa interpretasi HTML.
- **Pesan Memuat Tautan Pendek atau Samaran**: Regex validator mengevaluasi pola URL seperti `bit.ly`, `t.me`, domain `.id`, `.xyz`, dsb., dan langsung menolak teks tersebut sebelum mencapai basis data.
- **Preferensi Sensitivitas Gerak Pengunjung (`prefers-reduced-motion: reduce`)**: Letupan konfeti ditiadakan, dan animasi transisi daftar buku tamu disederhanakan tanpa pergerakan yang menyilaukan.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Seksi Kado Finansial (Digital Gift)
- **FR-001**: Sistem HARUS menyajikan data rekening bank dan QRIS yang bersumber eksklusif dari konfigurasi imutabel di server, tanpa ada endpoint API mutasi publik.
- **FR-002**: Sistem HARUS menyediakan fungsi salin satu-klik (*one-click copy*) untuk setiap nomor rekening bank dengan konfirmasi mikro (*toast*) "Nomor rekening tersalin" yang aktif selama 2 detik.
- **FR-003**: Sistem HARUS menyajikan kode QRIS dalam modal dialog yang menggunakan **latar belakang putih murni `#FFFFFF`** secara mutlak demi menjamin akurasi pemindaian lensa kamera ponsel.
- **FR-004**: Sistem HARUS mengunci pengguliran halaman halus (*Lenis smooth scroll*) selama modal dialog QRIS terbuka, dan memulihkannya ketika modal ditutup.
- **FR-005**: Sistem HARUS menyertakan teks disclaimer keamanan anti-penipuan: *"Nomor rekening hanya yang tercantum di halaman ini."* pada seksi kado finansial.

#### Formulir Konfirmasi Kehadiran (RSVP)
- **FR-006**: Sistem HARUS mendukung pengisian nama tamu secara otomatis jika terdapat parameter URL `?to=...`, dengan opsi bagi tamu untuk menyunting nama tersebut secara manual.
- **FR-007**: Sistem HARUS menyediakan selektor pilihan kehadiran berukuran penuh (*pill toggle*) antara "Hadir" dan "Berhalangan".
- **FR-008**: Sistem HARUS menampilkan pilihan jumlah tamu (1 hingga 5 orang) hanya ketika opsi "Hadir" dipilih, dan menyembunyikannya secara halus ketika opsi "Berhalangan" dipilih (mengirimkan nilai default 1 secara internal).
- **FR-009**: Sistem HARUS melakukan validasi panjang nama tamu (2–60 karakter) dan pesan doa restu (3–500 karakter).
- **FR-010**: Sistem HARUS memvalidasi dan menolak setiap pesan yang mengandung tautan website (*URL/hyperlink*) secara *real-time* di antarmuka pengguna maupun di gerbang Server Action.
- **FR-011**: Sistem HARUS menampilkan penghitung karakter pesan hanya setelah tamu mengetikkan minimal 400 karakter dari batas 500 karakter.
- **FR-012**: Sistem HARUS mengintegrasikan verifikasi bot Cloudflare Turnstile sebelum formulir dapat diproses oleh server.
- **FR-013**: Sistem HARUS memicu efek konfeti palet Surakarta selama 1.8 detik dan menampilkan kartu ucapan terima kasih santun setelah formulir berhasil dikirimkan, disertai tombol untuk mengirimkan ucapan tambahan.

#### Dinding Ucapan Realtime (Live Guestbook)
- **FR-014**: Sistem HARUS melakukan prefetch hingga 20 doa restu terbaru di tingkat server (SSR) pada pemuatan awal halaman untuk mencegah pergeseran tata letak (*zero cumulative layout shift*).
- **FR-015**: Sistem HARUS mendengarkan siaran penambahan data baru (*event INSERT*) dari kanal WebSocket Supabase Realtime CDC (`postgres_changes` pada tabel `rsvps`).
- **FR-016**: Sistem HARUS mengimplementasikan mekanisme *optimistic update* untuk pengirim lokal dan deduplikasi ID dua arah agar tidak terjadi entri ganda di antarmuka.
- **FR-017**: Sistem HARUS menampilkan setiap entri ucapan dengan pemisah garis halus 1px `--line` (tanpa tumpukan kartu berkontur/bayangan generik), lencana status kehadiran, dan penunjuk waktu relatif santun dalam bahasa Indonesia.
- **FR-018**: Sistem HARUS menganimasikan kemunculan entri doa baru dari posisi atas dengan transisi ketinggian `height: 0 -> auto` selama 240 milidetik.
- **FR-019**: Sistem HARUS menyediakan tombol pemuatan bertahap (*Load More*) untuk mengakses arsip ucapan terdahulu jika total ucapan melebihi batas tampilan awal.

#### Seksi Penutup (Closing Section)
- **FR-020**: Sistem HARUS menyajikan seksi penutup berlatar Malam Wulung (`#15120F`) yang memuat salam penutup santun, inisial monogram Prada Emas, serta nama lengkap kedua keluarga mempelai sesuai ritme seksi ke-10.

---

### Key Entities

- **GiftAccount**: Entitas imutabel rekening penerima kado finansial; atribut: `bankName`, `accountNumber`, `accountHolder`, `copyPayload`.
- **QrisAsset**: Entitas imutabel kode QRIS resmi; atribut: `imageUrl`, `merchantName`, `altText`.
- **RSVPPayload**: Data masukan formulir dari tamu; atribut: `guest_name`, `attendance_status`, `pax_count`, `message`, `turnstile_token`.
- **GuestbookWish**: Rekord ucapan doa restu tamu yang tersimpan dan disiarkan; atribut: `id`, `guest_name`, `attendance_status`, `pax_count`, `message`, `created_at`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tamu dapat menyelesaikan pengisian konfirmasi kehadiran dan doa restu dalam waktu kurang dari 60 detik pada layar ponsel cerdas.
- **SC-002**: Doa restu baru yang dikirimkan oleh salah satu tamu muncul di layar tamu lain yang sedang aktif dalam waktu kurang dari 1.5 detik melalui koneksi WebSocket.
- **SC-003**: 100% upaya pengiriman pesan yang memuat tautan/link berbahaya ditolak secara proaktif baik di peramban klien maupun di server, tanpa ada tautan yang lolos ke basis data.
- **SC-004**: Nilai Cumulative Layout Shift (CLS) pada seksi buku tamu saat pemuatan awal halaman adalah 0 (nol), berkat strategi SSR data prefetching.
- **SC-005**: 100% kode QRIS pada modal dialog terbaca dan terdekode dengan sukses oleh kamera pemindai ponsel berkat latar belakang putih murni `#FFFFFF` dengan rasio kontras optik maksimal.
- **SC-006**: Seluruh rangkaian pengujian unit otomatis (Vitest) mencapai tingkat kelulusan 100% tanpa adanya kesalahan kompilasi TypeScript (`pnpm typecheck` = 0 error) dan linting (`pnpm lint` = 0 warning/error).

---

## Assumptions

- Tamu undangan membuka halaman menggunakan peramban modern yang mendukung WebSockets (iOS Safari 14+, Android Chrome 90+, modern desktop browsers).
- Konfigurasi finansial (nomor rekening dan gambar QRIS) bersifat tetap selama masa perhelatan acara pernikahan berlangsung.
- Pengunjung yang memilih opsi "Berhalangan" secara implisit tidak membawa anggota keluarga lain, sehingga alokasi kursi diatur ke 1 secara internal tanpa mempengaruhi kuota fisik katering/venue.
- Layanan Supabase Realtime dan Cloudflare Turnstile beroperasi secara normal dengan latensi standar jaringan internet publik di Indonesia.
