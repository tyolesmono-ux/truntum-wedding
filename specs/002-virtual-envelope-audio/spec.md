# Feature Specification: Gerbang Pembuka (3D Virtual Envelope) & Audio Engine

**Feature Branch**: `002-virtual-envelope-audio`  
**Created**: 2026-09-19  
**Status**: Ready for Planning  
**Input**: User description: "Fase 2: Gerbang Pembuka (3D Virtual Envelope) & Audio Engine"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tamu Membuka Undangan Melalui Gerbang Amplop 3D (Priority: P1)

Sebagai seorang tamu undangan, ketika saya membuka tautan undangan di ponsel saya, saya ingin disambut oleh amplop virtual 3D yang elegan dan personal dengan nama saya, sehingga saya merasakan momen eksklusif dan kemewahan saat membuka segel lilin fisik atau menekan tombol pembuka untuk masuk ke halaman utama undangan.

**Why this priority**: Ini adalah pintu masuk pertama (*first impression*) dari seluruh pengalaman undangan pernikahan digital mewah. Tanpa gerbang pembuka ini, tamu langsung melihat halaman utama tanpa sentuhan personalisasi dan tanpa transisi fisik-ke-digital.

**Independent Test**: Dapat diuji secara independen dengan memuat halaman dengan parameter `?to=Budi+Sekeluarga`, memastikan amplop 3D tampil dengan nama yang sesuai, lalu mengetuk segel lilin atau tombol "Buka undangan" untuk memverifikasi rangkaian animasi (retak segel, flap terbuka, surat meluncur, dan overlay memudar) hingga scroll halaman utama terbuka.

**Acceptance Scenarios**:
1. **Given** tamu mengakses URL dengan parameter `?to=Nama+Tamu`, **When** halaman dimuat pertama kali, **Then** layar menampilkan gerbang amplop 3D layar penuh berlatar Malam Wulung dengan teks personalisasi "Kepada Bapak/Ibu/Saudara [Nama Tamu]" dan scroll halaman utama terkunci.
2. **Given** tamu berada di depan gerbang amplop, **When** tamu mengetuk stempel segel lilin (WaxSeal) atau tombol "Buka undangan", **Then** urutan gerak 4 langkah dieksekusi (segel retak 180ms, flap amplop berotasi naik 700ms, surat undangan meluncur naik 620ms, dan overlay memudar 500ms), lalu overlay di-unmount secara bersih dan scroll halaman utama terbuka.
3. **Given** tamu mengakses URL tanpa parameter nama atau bernilai kosong, **When** amplop dimuat, **Then** sistem menampilkan nama santun default "Tamu Undangan".

---

### User Story 2 - Tamu Menikmati Alunan Musik Latar yang Santun (Priority: P1)

Sebagai seorang tamu undangan, ketika saya membuka amplop undangan, saya ingin musik latar bernuansa gamelan/ambient instrumental pernikahan mulai mengalun secara perlahan dan halus (*fade-in*), tanpa mengejutkan pendengaran saya dan tanpa melanggar kebijakan autoplay browser.

**Why this priority**: Musik latar membangun atmosfer sakral dan emosional pernikahan. Sesuai prinsip *Zero-Tolerance Autoplay Policy*, audio tidak boleh diputar otomatis sebelum ada gestur fisik dari pengunjung.

**Independent Test**: Dapat diuji secara independen dengan memverifikasi bahwa audio tidak pernah memutar pada render awal. Begitu segel lilin atau tombol pembuka diklik, fungsi pemutar audio ter-unlock dan volume naik secara linier dari 0.0 ke 0.8 selama 2.5 detik.

**Acceptance Scenarios**:
1. **Given** halaman undangan baru saja dimuat, **When** belum ada interaksi sentuhan dari tamu, **Then** audio berstatus diam (suspended/silent) dan tidak ada panggilan pemutaran audio ke sistem.
2. **Given** tamu mengetuk segel lilin atau tombol "Buka undangan", **When** amplop mulai terbuka, **Then** Web Audio API membuka kunci (*unlock*) audio engine dan menaikkan volume secara linier dari 0.0 hingga 0.8 selama tepat 2.5 detik.

---

### User Story 3 - Pengendalian Musik Mengambang & Manajemen Tab Latar Belakang (Priority: P2)

Sebagai seorang tamu yang sedang membaca undangan, saya ingin memiliki kontrol pemutar musik mengambang (*Floating Vinyl Player*) di pojok kanan bawah yang berputar saat musik aktif, mudah dijeda/dimainkan kembali dengan transisi lembut, serta otomatis berhenti saat saya beralih ke aplikasi/tab lain untuk menghemat daya baterai dan kuota data seluler saya.

**Why this priority**: Memberikan kenyamanan kontrol audio penuh kepada pengunjung serta menjaga efisiensi baterai ponsel pintar tamu.

**Independent Test**: Dapat diuji secara independen dengan mengklik piringan vinyl mengambang untuk beralih antara status putar dan jeda, memverifikasi status rotasi CSS, serta memicu pergantian tab (`visibilitychange`) untuk memverifikasi auto-pause dan auto-resume.

**Acceptance Scenarios**:
1. **Given** musik sedang memutar, **When** tamu menekan tombol Floating Vinyl Player, **Then** audio mereda secara halus (micro-fade 150ms) sebelum berhenti, piringan vinyl mempertahankan sudut rotasi terakhirnya, dan label aksesibilitas berganti menjadi "Putar musik".
2. **Given** musik sedang dijeda, **When** tamu menekan tombol Floating Vinyl Player, **Then** audio kembali memutar dengan peningkatan halus (micro-fade 150ms), piringan vinyl melanjutkan rotasi dari sudut terakhir, dan label aksesibilitas berganti menjadi "Jeda musik".
3. **Given** musik sedang memutar di halaman undangan, **When** tamu berpindah ke aplikasi/tab lain (layar tersembunyi), **Then** audio otomatis berhenti untuk menghemat daya.
4. **Given** audio otomatis dijeda karena tab tersembunyi, **When** tamu kembali membuka tab undangan, **Then** audio otomatis melanjutkan pemutaran (*auto-resume*).

---

### User Story 4 - Aksesibilitas Penuh & Pengunjung dengan Sensitivitas Gerak (Priority: P3)

Sebagai tamu dengan sensitivitas gerak (*vestibular motion disorder*) atau pengguna pembaca layar (*screen reader*), saya ingin dapat membuka undangan dan mengontrol musik dengan nyaman tanpa animasi putar cepat yang memusingkan, serta dapat bernavigasi menggunakan keyboard.

**Why this priority**: Menjamin inklusivitas dan kepatuhan aksesibilitas WCAG AA untuk seluruh kalangan tamu undangan.

**Independent Test**: Dapat diuji secara independen dengan mengaktifkan mode `prefers-reduced-motion: reduce` di browser/OS, lalu membuka undangan untuk memastikan urutan 3D disederhanakan menjadi cross-fade 200ms dan piringan vinyl tidak berputar.

**Acceptance Scenarios**:
1. **Given** sistem operasi tamu mengaktifkan `prefers-reduced-motion: reduce`, **When** amplop dibuka, **Then** rotasi 3D flap ditiadakan dan digantikan oleh transisi *cross-fade* 200ms langsung ke halaman utama.
2. **Given** `prefers-reduced-motion: reduce` aktif, **When** musik memutar, **Then** piringan vinyl tidak berputar, melainkan status putar ditampilkan melalui indikator Play/Pause statis yang santun.
3. **Given** tamu bernavigasi menggunakan keyboard (`Tab`), **When** fokus mencapai segel lilin atau floating vinyl, **Then** muncul cincin fokus (*focus ring*) Prada Emas 2px dengan offset 4px dan dapat diaktifkan dengan tombol `Enter` atau `Space`.

---

### Edge Cases

- **Parameter URL Rusak atau Karakter Aneh**: Jika parameter `?to=` berisi karakter escape tidak valid atau script payload (misal `?to=%E0%A4%A`), parser menangani error dengan aman dan menggunakan fallback "Tamu Undangan" tanpa melempar runtime exception.
- **Interaksi Dobel Klik Cepat (Spamming)**: Jika tamu mengklik segel lilin atau tombol "Buka undangan" berkali-kali secara cepat, sistem hanya memproses klik pertama dan mengabaikan klik berikutnya untuk mencegah tumpukan animasi ganda.
- **Pembatasan Web Audio API di Browser Tertentu**: Jika lingkungan browser (seperti in-app webview lama) membatasi `AudioContext`, sistem beralih secara anggun (*graceful fallback*) ke modulasi volume native `HTMLAudioElement`.
- **Layar Ponsel Sangat Kecil ($\le 360\text{px}$)**: Dimensi amplop secara responsif menyusut proporsional (`w-[90vw] aspect-[3/2]`) sehingga tidak pernah terpotong atau menimbulkan scroll horizontal pada viewport sempit.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistem HARUS menampilkan gerbang pembuka amplop virtual layar penuh bertingkat (*fullscreen fixed overlay*) yang mengunci scroll halaman utama (`overflow: hidden`) sebelum amplop dibuka.
- **FR-002**: Sistem HARUS membaca dan mendekode nama tamu dari parameter URL pencarian `?to=...` dan menampilkannya di atas amplop dengan label formal: *"Kepada Bapak/Ibu/Saudara [Nama Tamu]"*.
- **FR-003**: Sistem HARUS menggunakan nilai cadangan santun *"Tamu Undangan"* bila parameter `to` tidak ditemukan atau bernilai string kosong.
- **FR-004**: Sistem HARUS menyediakan dua pemicu interaktif untuk membuka gerbang: stempel segel lilin monogram (WaxSeal) dan tombol utama teks `"Buka undangan"`.
- **FR-005**: Sistem HARUS mengorkestrasi urutan animasi pembukaan fisik-ke-digital secara presisi sesuai SSoT:
  - Retak segel lilin (180ms easeOut)
  - Rotasi naik flap amplop $180^\circ$ sumbu X (700ms)
  - Luncuran naik surat undangan (620ms, delay 280ms)
  - Fade-out overlay amplop (500ms, delay 760ms)
- **FR-006**: Sistem HARUS meng-unmount komponen overlay dari DOM setelah urutan animasi selesai via `AnimatePresence` dan memulihkan scroll normal halaman utama.
- **FR-007**: Sistem DILARANG KERAS memutar audio atau mengaktifkan `AudioContext` saat halaman dimuat pertama kali sebelum ada gestur fisik pengguna.
- **FR-008**: Sistem HARUS memulai pemutaran audio dengan peningkatan volume linier Web Audio API (*linear volume ramp*) dari `0.0` ke `0.8` selama tepat $2.5$ detik saat gestur pembukaan amplop terjadi.
- **FR-009**: Sistem HARUS menyediakan tombol pemutar piringan vinyl mengambang (`FloatingVinyl`) berdiameter 52px di sudut kanan bawah (`z-index: 40`).
- **FR-010**: Tombol pemutar vinyl HARUS berputar kontinu $360^\circ$ (durasi 12 detik) saat musik aktif dan mempertahankan posisi sudut rotasi saat dijeda (*paused*).
- **FR-011**: Tombol pemutar vinyl HARUS dilengkapi cincin kontras Prada Emas 1px permanen dan elevasi bayangan agar memiliki kontras tinggi yang jelas di atas seksi latar terang maupun seksi latar gelap.
- **FR-012**: Sistem HARUS menjeda audio secara otomatis saat tab browser tidak aktif (`document.visibilityState === 'hidden'`) dan melanjutkan pemutaran saat tab aktif kembali bila sebelumnya audio sedang berputar.
- **FR-013**: Sistem HARUS menerapkan transisi suara halus (*micro-fade*) 150ms saat beralih antara status jeda dan putar untuk mencegah suara retak tajam (*audio popping*).
- **FR-014**: Sistem HARUS menyederhanakan animasi amplop menjadi *cross-fade* 200ms langsung dan menonaktifkan rotasi piringan vinyl jika pengguna mengaktifkan preferensi `prefers-reduced-motion`.
- **FR-015**: Seluruh elemen interaktif HARUS mematuhi aksesibilitas WCAG AA (target sentuh minimal $44 \times 44\text{ px}$, fokus keyboard dengan cincin Prada Emas 2px offset 4px, dan `aria-label` yang berganti dinamis).

---

### Key Entities

- **InvitationGateState**: Status siklus hidup gerbang amplop:
  - `guestName`: Nama tamu yang ditampilkan pada sampul amplop.
  - `isOpened`: Status apakah amplop telah terbuka dan unmounted dari layar.
  - `isAnimating`: Status apakah tahapan animasi pembukaan sedang berlangsung.
- **AudioEngineState**: Status kontrol pemutar audio:
  - `isPlaying`: Status apakah alunan musik latar sedang berputar.
  - `isMuted`: Status apakah audio dalam mode senyap.
  - `isUnlocked`: Status apakah Web Audio API telah di-unlock oleh gestur fisik pengguna.
  - `currentVolume`: Level gain saat ini (rentang $0.0 - 0.8$).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% tamu yang mengetuk segel atau tombol pembuka berhasil masuk ke halaman utama dengan transisi mulus dan frame rate stabil 60 FPS pada pengujian perangkat seluler.
- **SC-002**: Nol insiden browser autoplay rejection di peramban seluler modern (iOS Safari, Android Chrome).
- **SC-003**: Volume audio mencapai target intensitas (0.8) secara konsisten dalam rentang waktu $2.5 \pm 0.1$ detik setelah segel diklik.
- **SC-004**: Penggunaan memori dan kinerja tetap optimal dengan ukuran bundle JavaScript awal tetap berada di bawah batas $\le 90\text{ KB}$ gzipped.
- **SC-005**: 100% tes unit otomatis lulus di Vitest dengan cakupan skenario happy path, edge cases, accessibility, dan Web Audio state machine.

---

## Assumptions

- Tamu membuka undangan melalui tautan seluler (smartphone viewport 390×844 px).
- Berkas audio ambient pernikahan berformat MP3 web-optimized tersedia secara lokal di `public/audio/wedding-ambient.mp3`.
- Peramban modern mendukung CSS 3D Transforms (`perspective`, `transform-style: preserve-3d`) dan Web Audio API standar.
- Pengaturan konfigurasi audio didefinisikan secara deklaratif di `src/lib/config/wedding-data.ts`.
