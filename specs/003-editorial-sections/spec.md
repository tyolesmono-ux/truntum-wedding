# Feature Specification: Seksi Halaman Utama & Narasi Editorial (Fase 3A)

**Feature Branch**: `003-editorial-sections`  
**Created**: 2026-09-19  
**Status**: Draft  
**Input**: User description: "Fase 3A: Seksi Halaman Utama & Editorial (3.1–3.6) berdasarkan Roadmap Pengerjaan dan SSoT Desain"  

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Menikmati Sampul Editorial dan Pembuka Kemewahan (Priority: P1)

Sebagai tamu undangan yang baru saja membuka segel amplop virtual, saya ingin disambut oleh sampul majalah pernikahan digital sinematik dengan tipografi nama mempelai yang megah dan berkarakter, agar saya langsung merasakan kehormatan, kehangatan, dan atmosfer perayaan yang sakral serta eksklusif.

**Why this priority**: Sampul depan (*Hero Cover*) adalah kesan visual pertama setelah gerbang amplop terbuka. Kualitas visual dan keanggunan tipografi di halaman ini menentukan impresi kemewahan seluruh undangan.

**Independent Test**: Dapat diuji secara mandiri dengan membuka amplop dan memverifikasi bahwa layar penuh menampilkan potret sinematik kedua mempelai, nama mempelai berukuran besar yang terbaca kontras, tanggal pernikahan, lokasi kota, serta indikator scroll yang santun.

**Acceptance Scenarios**:

1. **Given** tamu telah membuka amplop virtual, **When** halaman utama terbuka, **Then** sistem menampilkan sampul potret sinematik kedua mempelai berlayar penuh dengan lapisan gradasi hangat dan nama mempelai berukuran besar yang tampil elegan.
2. **Given** tamu mengakses melalui perangkat seluler (layar 390×844) atau desktop, **When** sampul dimuat, **Then** seluruh elemen teks berada dalam kontras tinggi terhadap latar belakang gelap dan tidak mengalami pergeseran tata letak (*zero layout shift*).
3. **Given** tamu mulai menggulir layar ke bawah, **When** melewati area sampul, **Then** terjadi transisi visual gradasi lembut dari latar gelap sinematik menuju latar gading keraton yang tenang.

---

### User Story 2 - Menyimak Ayat Suci Al-Qur'an dan Doa Restu Sakral (Priority: P2)

Sebagai tamu undangan yang religius dan menghormati nilai-nilai sakral, saya ingin membaca kaligrafi ayat Al-Qur'an (Surat Ar-Rum ayat 21) yang indah beserta terjemahan puitis dan doa sunnah pernikahan, agar saya dapat memahami landasan ibadah dari ikatan suci kedua mempelai dan turut mendoakan keberkahan mereka.

**Why this priority**: Seksi ini merupakan fondasi spiritual dan budaya pernikahan. Keanggunan kaligrafi Arab dan kejelasan terjemahan mencerminkan kekhidmatan akad nikah dalam tradisi keraton Surakarta.

**Independent Test**: Dapat diuji secara mandiri dengan menggulir ke seksi ayat suci dan memverifikasi keterbacaan teks Arab klasik berserta harakat lengkap, tanda kurung dekoratif ayat, terjemahan bahasa Indonesia, dan doa sunnah pernikahan.

**Acceptance Scenarios**:

1. **Given** tamu menggulir ke seksi ayat suci, **When** seksi memasuki bidang pandang (*viewport*), **Then** elemen kaligrafi dan terjemahan muncul secara bertingkat (*staggered reveal*) dengan gerakan yang tenang dan tidak berlebihan.
2. **Given** pembaca layar (*screen reader*) mengakses seksi ini, **When** membaca teks kaligrafi Arab, **Then** sistem mendeklarasikan atribut bahasa Arab dan arah penulisan kanan-ke-kiri (*RTL*) secara tepat.
3. **Given** teks terjemahan dan doa dibaca pada layar kecil, **When** ditampilkan, **Then** teks tersaji dalam bahasa Indonesia yang santun, puitis, dan menggunakan tipografi berjarak baris nyaman tanpa teks terpotong.

---

### User Story 3 - Mengenal Sosok dan Silsilah Kedua Mempelai (Priority: P3)

Sebagai keluarga besar atau kerabat jauh, saya ingin melihat profil mempelai pria dan wanita beserta nama orang tua dan garis silsilah keluarga secara terhormat, agar saya dapat mengenal kedua mempelai lebih dekat serta menyampaikan salam takzim kepada kedua pihak keluarga.

**Why this priority**: Undangan pernikahan bangsawan/formal menjunjung tinggi penghormatan kepada orang tua dan trah keluarga (*nasab*).

**Independent Test**: Dapat diuji secara mandiri dengan memverifikasi kartu profil mempelai pria dan wanita yang menampilkan foto berbingkai kubah khas Surakarta (*arch/ogee*), gelar formal, nama orang tua lengkap, dan tautan media sosial yang bersahaja.

**Acceptance Scenarios**:

1. **Given** tamu melihat profil mempelai pada layar ponsel, **When** seksi ditampilkan, **Then** profil mempelai pria dan wanita tersusun rapi secara vertikal dengan ornamen pemisah tradisional di tengahnya.
2. **Given** tamu melihat profil mempelai pada layar desktop atau tablet lebar, **When** seksi ditampilkan, **Then** profil tersaji dalam format dua kolom berdampingan (*editorial magazine spread*) yang proporsional.
3. **Given** tamu mengetuk tautan media sosial mempelai, **When** tautan dibuka, **Then** sistem membuka profil terkait di tab baru dengan label yang jelas dan santun.

---

### User Story 4 - Memantau Waktu Mundur Menuju Hari Bahagia (Priority: P4)

Sebagai tamu yang merencanakan kehadiran, saya ingin melihat waktu hitung mundur yang jelas (hari, jam, menit, detik) menuju hari pernikahan, agar saya mengetahui dengan pasti sisa waktu persiapan menjelang hari H.

**Why this priority**: Memberikan rasa antisipasi (*anticipation & excitement*) dan urgensi bagi tamu untuk mengatur jadwal perjalanan mereka.

**Independent Test**: Dapat diuji secara mandiri dengan memeriksa apakah angka hitung mundur bergerak setiap detik secara presisi tanpa menyebabkan lonjakan ukuran elemen teks (*tabular numerals*).

**Acceptance Scenarios**:

1. **Given** waktu sebelum hari H, **When** seksi hitung mundur dilihat, **Then** angka hari, jam, menit, dan detik berkurang secara akurat setiap detik dengan pemisah waktu yang berdenyut halus.
2. **Given** angka satuan detik berubah dari waktu ke waktu, **When** perubahan terjadi, **Then** lebar kotak angka tetap stabil dan tidak menyebabkan teks di sekitarnya bergoyang.
3. **Given** tanggal dan waktu acara telah tiba atau berlalu, **When** seksi dibuka, **Then** sistem menampilkan status formal yang menyatakan bahwa acara pernikahan sedang atau telah berlangsung dengan khidmat.

---

### User Story 5 - Memeriksa Rangkaian Acara dan Mengintegrasikan Jadwal/Lokasi (Priority: P5)

Sebagai tamu yang akan menghadiri acara, saya ingin melihat rincian waktu dan tempat untuk sesi Akad Nikah dan Resepsi Pernikahan, serta memiliki opsi satu-klik untuk menyimpan acara ke kalender ponsel dan membuka navigasi peta ke lokasi gedung, agar saya tidak salah waktu maupun tersesat di perjalanan.

**Why this priority**: Rincian acara adalah fungsi praktis paling penting dari sebuah undangan digital bagi kenyamanan mobilisasi fisik para tamu.

**Independent Test**: Dapat diuji secara mandiri dengan mengklik tombol "Tambah ke kalender" (menguji integrasi tautan kalender & pengunduhan berkas kalender) serta mengklik tombol "Buka peta venue" (menguji tautan navigasi langsung ke titik koordinat gedung).

**Acceptance Scenarios**:

1. **Given** tamu berada pada kartu Akad Nikah atau Resepsi, **When** tamu memilih tombol "Tambah ke kalender", **Then** sistem menyajikan pilihan untuk membuka langsung di Google Calendar dengan judul, tanggal, dan lokasi yang telah terisi, atau mengunduh berkas pengingat kalender standar (*.ics*).
2. **Given** tamu memilih tombol "Buka peta venue", **When** diklik, **Then** sistem membuka koordinat resmi gedung di aplikasi peta navigasi (Google Maps atau Waze) di tab/aplikasi baru.
3. **Given** tamu membaca informasi sesi acara, **When** membaca waktu, **Then** zona waktu (WIB) dan alamat gedung tertulis jelas, berjarak nyaman, dan mudah dipindai dengan cepat (*left-aligned format*).

---

### User Story 6 - Mengalami Pengguliran Halaman yang Sangat Halus dan Alami (Priority: P6)

Sebagai pengunjung yang menelusuri narasi panjang undangan, saya ingin merasakan pengguliran layar yang sangat mulus di komputer desktop tanpa patah-patah, serta tetap menikmati responsivitas sentuhan jari 60–120 FPS yang gesit di layar sentuh ponsel pintar saya.

**Why this priority**: Mengangkat pengalaman website dari sekadar halaman statis biasa menjadi setara dengan situs editorial fesyen mewah kelas dunia.

**Independent Test**: Dapat diuji secara mandiri dengan menggulir halaman naik dan turun pada perangkat desktop dan perangkat ponsel cerdas untuk memastikan kehalusan gerak serta ketiadaan jeda/hambatan saat berinteraksi.

**Acceptance Scenarios**:

1. **Given** tamu membuka undangan di komputer desktop menggunakan mouse wheel, **When** layar digulir, **Then** halaman meluncur dengan inersia yang halus dan elegan tanpa patah-patah.
2. **Given** tamu membuka undangan di layar sentuh ponsel (iOS / Android), **When** mengusap layar, **Then** gerak gulir mengikuti gesekan jari secara langsung (native momentum touch) pada frame rate 60 FPS tanpa jeda eksekusi naskah.
3. **Given** gerbang amplop virtual masih tertutup sebelum segel diklik, **When** tamu mencoba menggulir layar, **Then** pengguliran halaman terkunci dengan sempurna hingga tamu membuka undangan.

---

### Edge Cases

- **Tamu dengan koneksi internet lambat**: Seluruh teks judul, ayat Al-Qur'an, dan jadwal acara harus langsung terbaca dengan tipografi cadangan sistem yang selaras sebelum font eksternal selesai dimuat (*zero layout shift*).
- **Tamu dengan preferensi gerak berkurang (*prefers-reduced-motion*)**: Seluruh animasi kemunculan bertingkat dan denyut waktu dinonaktifkan; konten langsung tampil utuh tanpa efek transisi gerak.
- **Tampilan pada layar sangat sempit (lebar 320px seperti iPhone SE generasi awal)**: Teks nama pengantin, angka hitung mundur, dan tombol kalender/peta menyesuaikan ukuran secara otomatis tanpa ada teks yang terpotong ke samping atau tombol yang tumpang-tindih.
- **Waktu sistem pengguna tidak sinkron**: Hitung mundur hari H dihitung secara aman tanpa menimbulkan ketidaksesuaian tampilan awal antara server dan peramban pengguna.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistem HARUS mengunci seluruh pergerakan gulir halaman selama amplop virtual belum dibuka oleh pengguna.
- **FR-002**: Sistem HARUS menampilkan seksi sampul (*Hero*) berlayar penuh dengan potret sinematik kedua mempelai, nama kedua mempelai berukuran besar dengan gaya Didone, tanggal pernikahan, dan kota pelaksanaan.
- **FR-003**: Sistem HARUS menerapkan transisi visual warna lembut dari latar gelap sampul menuju latar gading seksi berikutnya.
- **FR-004**: Sistem HARUS menampilkan Surat Ar-Rum ayat 21 dalam teks kaligrafi Arab berkualitas tinggi, lengkap dengan tanda kurung ayat dekoratif, terjemahan bahasa Indonesia, dan doa berkah pernikahan.
- **FR-005**: Teks kaligrafi Arab HARUS memiliki penanda bahasa dan arah baca kanan-ke-kiri (*RTL*) yang sesuai standar aksesibilitas web.
- **FR-006**: Sistem HARUS menampilkan seksi profil mempelai pria dan wanita secara terpisah dengan foto berbingkai kubah keraton (*arch/ogee*), gelar kehormatan, nama lengkap orang tua, dan tautan media sosial yang santun.
- **FR-007**: Tata letak profil mempelai HARUS tersusun vertikal pada layar ponsel dan melebar menjadi dua kolom berdampingan pada layar desktop atau tablet.
- **FR-008**: Sistem HARUS menyediakan penghitung waktu mundur dinamis menuju waktu Akad Nikah yang mencakup hari, jam, menit, dan detik.
- **FR-009**: Angka pada penghitung waktu mundur HARUS berjarak tetap (*tabular width*) sehingga tidak mengubah lebar elemen saat detik bertambah atau berkurang.
- **FR-010**: Sistem HARUS menampilkan pesan formal penutup ketika waktu target hitung mundur telah terlewati.
- **FR-011**: Sistem HARUS menampilkan jadwal terpisah untuk sesi Akad Nikah dan Resepsi Pernikahan yang memuat rentang jam pelaksanaan (WIB), nama ruangan/gedung, dan alamat lengkap.
- **FR-012**: Setiap sesi acara HARUS menyediakan tombol "Tambah ke kalender" yang memungkinkan tamu membuka acara di Google Calendar atau mengunduh berkas kalender universal (*.ics*).
- **FR-013**: Setiap sesi acara HARUS menyediakan tombol navigasi langsung menuju titik koordinat resmi venue di aplikasi Google Maps dan Waze.
- **FR-014**: Seluruh teks, label, dan tombol di seluruh seksi HARUS ditulis dalam gaya penulisan kalimat (*sentence case*), tanpa huruf kapital berlebih (*all-caps*) atau teks miring yang mengganggu keterbacaan.
- **FR-015**: Seluruh data teks editorial (nama mempelai, orang tua, ayat suci, tanggal, alamat, koordinat) HARUS tersimpan dalam konfigurasi statis yang tidak dapat diubah oleh publik.

---

### Key Entities *(include if feature involves data)*

- **Mempelai (WeddingPerson)**: Mewakili profil mempelai (pria atau wanita), mencakup nama lengkap bergelar, nama panggilan, peran, nama ayah, nama ibu, URL foto potret, dan nama akun media sosial.
- **Kutipan Sakral (SacredQuote)**: Mewakili landasan spiritual pernikahan, mencakup nama surah, nomor surah, nomor ayat, teks kaligrafi Arab asli, terjemahan bahasa Indonesia puitis, dan doa sunnah pernikahan.
- **Sesi Acara (EventSession)**: Mewakili rangkaian acara (Akad Nikah atau Resepsi), mencakup nama sesi, waktu mulai dan selesai, zona waktu, nama gedung, alamat lengkap, tautan Google Maps, tautan Waze, dan rincian berkas kalender.
- **Target Waktu (CountdownTarget)**: Waktu spesifik pelaksanaan acara utama yang menjadi jangkar perhitungan mundur sisa waktu.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tamu dapat membaca seluruh informasi kritis (nama mempelai, tanggal pernikahan, jam akad, jam resepsi, dan alamat venue) dalam waktu kurang dari 15 detik setelah membuka undangan.
- **SC-002**: Pengguliran halaman mempertahankan tingkat kelancaran 60 frame per detik (FPS) di seluruh perangkat seluler target (iPhone 12/13/14 dan Android kelas menengah).
- **SC-003**: Tombol "Tambah ke kalender" dan "Buka peta venue" berhasil mengarahkan pengguna ke aplikasi kalender dan peta terkait dengan tingkat keberhasilan 100% pada peramban seluler populer.
- **SC-004**: Tidak ada pergeseran tata letak kumulatif (*Cumulative Layout Shift* = 0) saat font dan gambar dimuat.
- **SC-005**: Tingkat kontras warna seluruh teks terhadap latar belakangnya memenuhi standar aksesibilitas WCAG AA (minimal rasio kontras 4.5:1 untuk teks standar dan 3:1 untuk teks berukuran besar).
- **SC-006**: Seluruh pengujian otomatis (*unit tests*) untuk seksi editorial utama lulus dengan tingkat kelulusan 100%.

---

## Assumptions

- **Karakteristik Tamu**: Mayoritas tamu (≥95%) membuka tautan undangan dari aplikasi pesan instan seluler (WhatsApp / Telegram / Instagram).
- **Jadwal Acara**: Jadwal Akad Nikah dan Resepsi diselenggarakan pada hari yang sama atau berurutan dengan zona waktu Indonesia Barat (WIB).
- **Kepatuhan SSoT**: Skema warna, jenis font, dan ornamen budaya Jawa sepenuhnya mengacu pada dokumen tata kelola desain proyek ([`DESIGN.md`](docs/DOKUMEN_TEKNIS/DESIGN.md)) tanpa penambahan font atau warna baru di luar palet resmi Surakarta.
- **Batasan Cakupan**: Fitur Linimasa Kisah Cinta interaktif (*Love Story Timeline*) dan Galeri Foto Masonry berserta Lightbox gestur sentuh didekomposisi ke dalam sub-fase berikutnya (Fase 3B) untuk menjaga isolasi komponen dan pengujian terfokus.
