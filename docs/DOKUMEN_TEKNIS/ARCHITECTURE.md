# System Architecture Specification (ARCHITECTURE.md)
## Bespoke Luxury Digital Wedding Invitation

- **Version**: 1.0.0
- **Status**: Approved / Ready for Implementation
- **Author**: Antigravity Technical Architecture Team
- **Related Spec**: [`PRD.md`](./PRD.md)
- **Tech Stack**: [`TECH_STACK.md`](./TECH_STACK.md)
- **Design System**: [`DESIGN.md`](./DESIGN.md)

---

## 1. Executive Architectural Summary

Arsitektur aplikasi **Bespoke Luxury Digital Wedding Invitation** dibangun dengan pola modern berbasis **Next.js 15 App Router**, memanfaatkan keunggulan **React Server Components (RSC)** untuk meminimalkan beban JavaScript di sisi browser, dikombinasikan dengan **Client Components** berkinerja tinggi untuk pengalaman interaktif 60 FPS.

Sistem mengadopsi model **Zero-Trust User Input** dengan pemisahan tegas antara data konstan yang bersifat sensitif (seperti nomor rekening bank dan QRIS) dengan data dinamis yang berasal dari input pengguna (buku tamu dan RSVP).

---

## 2. High-Level Architecture Diagram

Berikut adalah arsitektur menyeluruh dari sistem, menggambarkan interaksi antara browser tamu, CDN Edge Vercel, Next.js Server / Server Actions, dan Supabase Backend:

```mermaid
graph TD
    subgraph ClientDevice["📱 Client Device (Mobile Safari / Android Chrome)"]
        direction TB
        OGPreview["WhatsApp / IG Link Preview<br/>(?to=Nama+Tamu)"]
        BrowserWindow["Browser Window"]
        
        subgraph ClientUI["Client Interactive Experience"]
            EnvelopeGate["Opening Gate (3D Virtual Envelope)"]
            WaxSealBtn["Wax Seal Button (Monogram)"]
            AudioEngine["Web Audio API Engine (GainNode Fade-In)"]
            VinylPlayer["Floating Vinyl Audio Player (360° Spin)"]
            SmoothScroll["Lenis Smooth Scroll Engine"]
            MainSections["Editorial Sections (Hero, Quotes, Event, Gallery)"]
            GiftModal["Protected Digital Gift (Bank & QRIS)"]
            RSVPForm["RSVP & Wishes Form + Turnstile"]
            LiveWall["Realtime Guestbook Wall"]
        end
    end

    subgraph EdgeVercel["⚡ Vercel Edge Network / Next.js Server"]
        direction TB
        Middleware["Security Middleware<br/>(CSP, HSTS, X-Frame, CORS)"]
        EdgeOG["/api/og Route Handler<br/>(@vercel/og / Satori)"]
        PageSSR["Root Page SSR (RSC + Static HTML)"]
        ServerActionRSVP["Server Action: submitRSVP<br/>(Zod + DOMPurify + Rate Limiter)"]
        ServerConfig["Hardened Config: wedding-data.ts<br/>(Rekening, QRIS, Jadwal - Read-Only)"]
    end

    subgraph Cloudflare["🛡️ Cloudflare Security"]
        TurnstileAPI["Cloudflare Turnstile Verification API<br/>(/turnstile/v0/siteverify)"]
    end

    subgraph SupabasePlatform["☁️ Supabase Cloud (PostgreSQL 15+)"]
        direction TB
        DB_RSVPS[("public.rsvps Table<br/>(Row Level Security Enabled)")]
        CDC_Engine["PostgreSQL CDC Engine"]
        RealtimeWS["Supabase Realtime WebSocket Hub"]
    end

    %% Flow connections
    OGPreview -.->|Request dynamic image| EdgeOG
    BrowserWindow -->|1. Initial HTTP GET| Middleware
    Middleware --> PageSSR
    PageSSR -->|Hydrate initial bundle < 90KB| EnvelopeGate
    
    WaxSealBtn -->|User Gesture: Crack & Open| AudioEngine
    WaxSealBtn -->|Reveal Main Content| SmoothScroll
    AudioEngine --> VinylPlayer
    
    ServerConfig -.->|Inject hardcoded data| GiftModal
    ServerConfig -.->|Inject couple & event data| MainSections

    RSVPForm -->|2. Submit Form via Server Action| ServerActionRSVP
    ServerActionRSVP -->|3. Verify Captcha Token| TurnstileAPI
    ServerActionRSVP -->|4. Validated & Sanitized INSERT| DB_RSVPS
    
    DB_RSVPS -->|5. PostgreSQL WAL Insert Event| CDC_Engine
    CDC_Engine --> RealtimeWS
    RealtimeWS -->|6. Broadcast ws payload| LiveWall
```

---

## 3. Directory & Code Organization

Struktur direktori proyek dirancang secara modular dengan pemisahan tugas (*Separation of Concerns*) yang jelas antara Server Components dan Client Components:

```
/src
├── app/
│   ├── api/
│   │   └── og/
│   │       └── route.tsx               # [Edge] Dynamic OG Image generator (?to=Nama)
│   ├── layout.tsx                      # [Server] Root layout, metadata base, font definitions
│   ├── page.tsx                        # [Server] Main page orchestrator (Async searchParams await & initial data fetching)
│   └── globals.css                     # Global styles, Tailwind utilities, luxury CSS variables
│
├── components/
│   ├── audio/
│   │   ├── AudioController.tsx         # [Client] Web Audio Context provider & audio state
│   │   └── FloatingVinyl.tsx           # [Client] Rotating vinyl disk toggle (mute/play)
│   │
│   ├── opening/
│   │   ├── OpeningGate.tsx             # [Client] Master container for the 3D envelope overlay
│   │   ├── VirtualEnvelope.tsx         # [Client] 3D realistic envelope with CSS preserve-3d
│   │   ├── WaxSeal.tsx                 # [Client] Interactive wax seal with cracking animation
│   │   └── InvitationLetter.tsx        # [Client] Elegant letter sliding up from envelope pocket
│   │
│   ├── sections/
│   │   ├── HeroSection.tsx             # [Client] Editorial magazine hero cover & typography
│   │   ├── IslamicQuotes.tsx           # [Server/Client] Ar-Rum 21 & Sunnah wedding prayer
│   │   ├── CoupleProfile.tsx           # [Server/Client] Groom & Bride visual profile
│   │   ├── CountdownSection.tsx        # [Client] Live countdown timer to wedding day
│   │   ├── EventDetails.tsx            # [Client] Akad & Resepsi, Add-to-Calendar & Maps
│   │   ├── LoveStoryTimeline.tsx       # [Client] Scroll-linked vertical progress timeline
│   │   ├── GalleryMasonry.tsx          # [Client] Editorial photo masonry & swipeable Lightbox
│   │   ├── DigitalGift.tsx             # [Client] Read-only Bank Account & QRIS modal
│   │   └── RSVPAndWishes.tsx           # [Client] Interactive form & Realtime guestbook wall
│   │
│   └── ui/
│       ├── Button.tsx                  # Luxury button variant component
│       ├── Modal.tsx                   # Accessible modal container with backdrop blur
│       ├── Tooltip.tsx                 # Micro-interaction tooltip (e.g. "Copied!")
│       └── Confetti.tsx                # Trigger wrapper for canvas-confetti
│
├── lib/
│   ├── config/
│   │   └── wedding-data.ts             # [IMMUTABLE SERVER CONSTANTS] Rekening, QRIS, Jadwal
│   ├── supabase/
│   │   ├── client.ts                   # Supabase browser client (Anon key, RLS enforced)
│   │   └── server.ts                   # Supabase server client (Service role for secure actions)
│   ├── security/
│   │   ├── sanitize.ts                 # DOMPurify HTML stripping & anti-phishing link filter
│   │   └── rate-limiter.ts             # IP-based sliding window rate limiter
│   └── validations/
│       └── rsvp-schema.ts              # Zod schema validation rules
│
├── actions/
│   └── submit-rsvp.ts                  # Next.js Server Action for secure RSVP handling
│
└── types/
    ├── index.ts                        # Global TypeScript interfaces
    └── supabase.ts                     # Database generated types (PostgreSQL schema)
```

---

## 4. Component Lifecycle & User Journey Flow

Perjalanan pengguna dirancang dari awal hingga akhir dengan tahapan status (*state machine*) yang terdefinisi:

```mermaid
stateDiagram-v2
    [*] --> Arrival: Klik Tautan WhatsApp (?to=Nama+Tamu)
    
    state Arrival {
        [*] --> DynamicOG: Render OpenGraph Card di WhatsApp
        DynamicOG --> GateLocked: Buka Halaman Web di Browser
    }

    state GateLocked {
        [*] --> VirtualEnvelopeDisplay: Amplop 3D Bertekstur Tertutup
        VirtualEnvelopeDisplay --> WaxSealClick: Tamu Menekan Segel Lilin
    }

    state GateOpening {
        WaxSealClick --> CrackAnimation: Animasi Lilin Retak
        CrackAnimation --> FlapRotate: Flap Amplop Berputar Terbuka
        FlapRotate --> LetterSlide: Surat Meluncur Naik
        LetterSlide --> AudioUnlock: Web Audio API Fade-In (0 -> 0.8 dlm 2.5s)
        AudioUnlock --> GateFadeOut: Amplop Memudar Keluar
    }

    state MainInvitationExperience {
        GateFadeOut --> HeroEditorial
        HeroEditorial --> LenisScroll: Gulir Halaman dengan Inersia
        LenisScroll --> QuranSection: Baca Ayat Ar-Rum 21
        QuranSection --> EventSection: Detail Akad & Resepsi
        EventSection --> CalendarSync: Simpan ke Google/Apple Calendar
        EventSection --> GallerySection: Jelajahi Galeri Editorial
        GallerySection --> GiftSection: Salin No. Rekening / Scan QRIS
        GiftSection --> RSVPSection: Isi Form RSVP & Doa
    }

    state RSVP_Submission {
        RSVPSection --> TurnstileCheck: Validasi Bot Cloudflare
        TurnstileCheck --> SanitizationCheck: Sanitasi XSS & Tolak URL
        SanitizationCheck --> DB_Insert: Simpan ke Supabase PostgreSQL
        DB_Insert --> ConfettiCelebration: Letupan Konfeti Canvas
        DB_Insert --> RealtimeBroadcast: Terbit ke Live Guestbook Wall
    }

    RSVP_Submission --> [*]
```

---

## 5. Audio State Machine & Autoplay Compliance

Satu tantangan teknis terbesar pada browser seluler modern (khususnya iOS WebKit) adalah pembatasan ketat terhadap pemutaran audio otomatis (*autoplay policy*). 

Sistem ini memecahkan masalah tersebut dengan menjamin pemutaran audio hanya terjadi sebagai kelanjutan langsung dari interaksi sentuhan (*user gesture*) pada segel lilin:

```mermaid
stateDiagram-v2
    [*] --> Uninitialized: Aplikasi Dimuat
    Uninitialized --> Suspended: AudioContext Dibuat (State: Suspended)
    
    state "Interaksi Pengguna (User Gesture)" as Gesture {
        Suspended --> Resuming: Tamu Menyentuh Wax Seal
        Resuming --> FadingIn: audioContext.resume() Sukses
    }

    state "Active Audio Playback" as PlayingState {
        FadingIn --> Playing: GainNode Ramp (0 -> 0.8 dalam 2500ms)
        Playing --> Muted: Pengguna Menekan Floating Vinyl
        Muted --> Playing: Pengguna Menekan Floating Vinyl Lagi
    }

    state "Background / Tab Switch" as BackgroundState {
        Playing --> PausedOnHidden: document.visibilityState == 'hidden'
        PausedOnHidden --> Playing: document.visibilityState == 'visible'
    }
```

### Implementasi Logika Audio Controller
1. **AudioContext Resume**: Saat event `onClick` atau `onTouchStart` pada komponen `WaxSeal.tsx`, fungsi audio controller memanggil:
   ```typescript
   if (audioContext.state === 'suspended') {
     await audioContext.resume();
   }
   ```
2. **GainNode Linear Ramp**: Menggunakan `gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 2.5)` untuk mencegah suara mengagetkan tamu.
3. **Visibility Handler**: Ketika tamu meminimalkan browser atau beralih ke aplikasi lain, pemutaran otomatis dijeda untuk menghemat baterai dan kuota tamu.

---

## 6. Security Architecture & Zero-Trust Model

Sistem menerapkan prinsip **Zero Trust on User Input** dan perlindungan mendalam (*Defense-in-Depth*):

```mermaid
flowchart TD
    subgraph ClientZone["Uncontrolled Client Zone"]
        UserInput["Raw User Input<br/>(Nama, Pesan Doa, Pax)"]
        Attacker["Potential Malicious Payload<br/>(<script>, phishing link, bot flood)"]
    end

    subgraph SecurityPerimeter["Next.js Security Perimeter"]
        MiddlewareSecurity["HTTP Security Middleware<br/>- Strict CSP (No inline unsafe script execution)<br/>- X-Frame-Options: DENY<br/>- Referrer-Policy: strict-origin"]
        RateLimiter["IP Rate Limiter<br/>(Max 3 requests / 10 mins per IP)"]
        TurnstileValidator["Cloudflare Turnstile Verification<br/>(Secret Key Validation via HTTPS)"]
        ZodParser["Zod Strict Schema Validation<br/>- Name: max 60 chars<br/>- Message: max 500 chars<br/>- Pax: integer between 1 and 5"]
        Sanitizer["Sanitization Engine (DOMPurify)<br/>- Strip all HTML/SVG/XML tags<br/>- Reject URL patterns: /(https?://|www\.)/i"]
    end

    subgraph CoreStorage["Secured Database Layer"]
        SupabaseClient["Supabase Service Role Client"]
        RLS_Engine["PostgreSQL Row Level Security<br/>- Public: SELECT allowed<br/>- Public: INSERT via Server Action<br/>- UPDATE/DELETE: RESTRICTED TO ADMIN"]
        DB_Table[("public.rsvps")]
    end

    subgraph ProtectedFinancialData["Hardened Financial Constants (Read-Only)"]
        ConfigFile["lib/config/wedding-data.ts<br/>- Bank BCA & Mandiri Numbers<br/>- Official QRIS Image Asset<br/>*CANNOT BE OVERWRITTEN BY ANY API*"]
    end

    UserInput --> MiddlewareSecurity
    Attacker --> MiddlewareSecurity
    MiddlewareSecurity --> RateLimiter
    RateLimiter --> TurnstileValidator
    TurnstileValidator --> ZodParser
    ZodParser --> Sanitizer
    Sanitizer --> SupabaseClient
    SupabaseClient --> RLS_Engine
    RLS_Engine --> DB_Table

    ProtectedFinancialData -.->|Read Directly by Server Components| GiftModal["DigitalGift Component"]
```

### 6.1 Anti-Tampering Finansial
- Nomor rekening bank dan QRIS **TIDAK PERNAH** disimpan di dalam tabel database publik yang memiliki endpoint mutasi.
- Data rekening didefinisikan secara deklaratif di `src/lib/config/wedding-data.ts` sebagai konstanta TypeScript `readonly`.
- Penyerang yang mencoba mengirim request manipulasi API tidak akan pernah dapat mengubah rekening tujuan transfer donasi.

### 6.2 Pencegahan Stored XSS & Phishing
- Seluruh karakter pesan buku tamu disanitasi oleh `DOMPurify` di sisi server sebelum menyentuh database.
- Pesan yang mengandung tautan (URL) akan ditolak secara eksplisit dengan melempar exception: *"Pesan tidak boleh mengandung tautan link web demi keamanan bersama."*
- Saat ditampilkan di *Live Guestbook Wall*, data di-render sebagai node teks murni React: `<p>{wish.message}</p>`. Dilarang keras menggunakan `dangerouslySetInnerHTML`.

---

## 7. Performance & Optimization Architecture

Target performa utama: **60 FPS di layar seluler dengan initial bundle JavaScript $\le 90$ KB gzipped**.

### 7.1 Strategi Optimasi Bundel
1. **Dynamic Imports (`next/dynamic`)**:
   Komponen yang berada di bawah lipatan layar (*below-the-fold*) dimuat secara dinamis saat dibutuhkan:
   - `GalleryMasonry.tsx` (Lazy loaded saat pengguna menggulir mendekati section galeri).
   - `DigitalGift.tsx` (Lazy loaded modal).
   - `RSVPAndWishes.tsx` (Lazy loaded form & realtime wall).
2. **Subsetting Font Arab**:
   Menggunakan font *Amiri* yang di-subset hanya untuk karakter yang digunakan pada Surat Ar-Rum: 21 dan doa pernikahan, memangkas ukuran font dari $\sim 500$ KB menjadi $\le 30$ KB.
3. **Format Gambar Generasi Berikutnya**:
   Seluruh foto diproses menjadi format `.webp` atau `.avif` dengan kompresi kualitas visual $82\%$, resolusi maksimal $1200\text{px}$, dan ukuran berkas $\le 150$ KB.
4. **Hardware-Accelerated CSS Transitions**:
   Semua animasi 3D amplop menggunakan properti `transform: translate3d(...) rotateX(...) rotateY(...)` dan `will-change: transform` untuk memaksa rendering ditangani oleh GPU ponsel (*compositing layer*), menghindari pembebanan CPU (*reflow/repaint*).
