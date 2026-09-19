<!--
# Sync Impact Report
- Version change: 1.0.0 → 1.1.0 (MINOR: Testing Gates, Context7 Planning Mandate, Engineering Loop & Definition of Done)
- List of modified principles & governance:
  - Development Workflow & Quality Gates:
    - Ratified the 5-Phase Engineering Loop (Context/Discovery, Planning/Restraint, Test-First, Minimal Implementation, DoD Verification).
    - Mandated Context7 documentation verification in all planning & specification phases (/grill-me, /brainstorming, /writing-plans, /speckit-plan).
    - Enforced mandatory automated unit testing per feature (Vitest + RTL, covering security, validations, audio state, and server actions).
    - Enforced 6-pillar Definition of Done (DoD) compliance before declaring completion.
- Added sections:
  - Loop Engineering & Quality Gates Workflow
  - Definition of Done (DoD) Invariants
- Removed sections:
  - None
- Follow-up TODOs:
  - None. All requirements derived from PRD, DESIGN.md, CODING_STANDARD.md, and system specifications.
-->

# Bespoke Luxury Digital Wedding Invitation Constitution

## Core Principles

### I. Single Source of Truth (SSoT) Design & Editorial Aesthetics (NON-NEGOTIABLE)
`docs/DOKUMEN_TEKNIS/DESIGN.md` serves as the sole and absolute Single Source of Truth (SSoT) for all visual layouts, color palettes, typography hierarchies, Javanese cultural ornaments, and motion physics.
- The visual direction is modern high-fashion editorial (inspired by *Kinfolk* and *Vogue*) harmonized with royal Surakarta heritage (Batik Sogan Solo, Dodot Keraton, and Wulung).
- Color tokens MUST strictly use the Surakarta palette: Gading Keraton (`#F6F1E7`), Melati (`#FCFAF5`), Kertas Batik (`#E8DCC8`), Malam Wulung (`#15120F`), Wulung (`#231F1B`), Sogan Tua (`#6B4423`), Sogan Muda (`#B07D4A`), Prada Emas (`#C2A05B`), and Cinde (`#8C2F27`). Arbitrary hex colors or generic palettes are strictly prohibited.
- Typography is restricted to exactly three font families: **Bodoni Moda** (Display & Headings $\ge 22\text{px}$), **Jost** (Body, UI, data, and form labels), and **Amiri** (high-precision Arabic calligraphy subset for Quranic verse Ar-Rum: 21). Script, handwriting, or novelty fonts are forbidden.
- Sentence case MUST be used for all labels, headings, and buttons. Tracked uppercase eyebrow labels and all-caps buttons are forbidden anti-patterns.
- Anti-template invariants: No full-color batik backgrounds, no card-list stacking for guestbook (must use 1px divider lines), no hover effects on cards, and no fade-up animations on every section. Section reveal animations are permitted ONLY for the Sacred Verse and Love Story sections.

### II. Zero-Trust Financial Security & Anti-Tampering (NON-NEGOTIABLE)
Because digital wedding invitations are exposed to public traffic while displaying wedding gift recipient details, the system enforces complete physical and architectural isolation between user input mutations and financial gift presentation.
- Official bank accounts (BCA, Mandiri) and QRIS payment assets MUST NEVER be stored in public database tables, mutable database rows, or exposed through REST/GraphQL API endpoints.
- All financial gift data MUST be defined as immutable, server-only constants in `src/lib/config/wedding-data.ts` using TypeScript `as const` and `readonly`.
- Modifying recipient bank accounts or QRIS data can ONLY occur through verified Git code deployment.
- The QRIS display modal MUST use a pure white background (`#FFFFFF`) rather than an ivory background to guarantee optical camera scanner decodability across diverse mobile banking applications.

### III. Defense-in-Depth Input Sanitization & Anti-Abuse (NON-NEGOTIABLE)
All user-submitted content (RSVP responses and guestbook well-wishes) is treated as untrusted and potentially adversarial.
- Validation: All inputs MUST pass strict Zod schema validation (guest name $2-60$ chars, message $3-500$ chars, pax $1-5$, attendance enum).
- Sanitization: All text fields MUST be sanitized on the server with `DOMPurify` (`isomorphic-dompurify`). All HTML tags, XML elements, SVG blocks, script tags, and markdown markup MUST be completely stripped.
- Anti-Phishing: The system MUST evaluate incoming messages against URL regex patterns (`/(https?:\/\/|www\.|\.com|\.org|\.net|\.id|\.xyz|bit\.ly|t\.me)/i`). Any message containing a URL, hyperlink, or domain pattern MUST be rejected immediately with an informative error.
- Safe Rendering: Guestbook messages MUST be rendered exclusively as React text string children (`<p>{item.message}</p>`). Using `dangerouslySetInnerHTML` is punishable as a critical security violation.
- Anti-Bot & Rate Limiting: Submissions require valid Cloudflare Turnstile token verification evaluated server-side. Submissions are capped at a maximum of 3 requests per IP per 10 minutes via a sliding-window limiter, using salted SHA-256 IP hashing to prevent plain IP storage and protect guest privacy.

### IV. Mobile-First 60 FPS Performance & Autoplay Compliance (NON-NEGOTIABLE)
More than 95% of guests access the application through smartphone chat links (iOS Safari and Android Chrome).
- Target viewport: Optimized primarily for 390×844 viewport (iPhone) with responsive scale-up capped at 480px (mobile) and 720px (desktop center).
- 60 FPS Budget: Initial JavaScript bundle MUST NOT exceed 90 KB gzipped. Components below the fold (Gallery, Gift, RSVP) MUST be code-split using `next/dynamic`.
- Hardware Acceleration: Transitions MUST animate only GPU-composited properties (`transform: translate3d/rotate3d`, `opacity`). Animating layout-triggering geometric properties (`top`, `left`, `margin`, `width`) is prohibited, with the singular exception of guestbook realtime entry insertion (`height: 0 → auto`, 240ms) to explain DOM state changes.
- Lenis Inertial Scroll: Lenis smooth scroll engine MUST run with `lerp: 0.085`, pausing automatically when modal overlays are visible.
- Audio Autoplay Compliance: In compliance with mobile WebKit and Blink autoplay restrictions, audio MUST NEVER autoplay on initial page load. Audio playback MUST be unlocked exclusively by explicit user touch interaction on the wax seal button (`WaxSeal.tsx`), initiating a linear volume ramp from 0.0 to 0.8 over 2.5 seconds via Web Audio API. Background tabs MUST pause playback on `visibilitychange`.

### V. Server Components by Default & Strict TypeScript Safety (NON-NEGOTIABLE)
- Architecture: React Server Components (RSC) are the default rendering paradigm in the Next.js 15 App Router. The `'use client'` directive MUST be reserved strictly for leaf components requiring state, motion hooks, audio events, or browser APIs.
- Mutations: All state mutations MUST be executed via Next.js Server Actions with `'use server'` and standardized `ActionResponse<T>` envelope returns. No raw public POST endpoints.
- TypeScript Rigor: `strict: true` is strictly enforced. The use of `any` or loose `as any` type casting is forbidden. All external data MUST be validated via Zod before consumption.
- Database Isolation: PostgreSQL Row Level Security (RLS) MUST be enabled on `public.rsvps`. `UPDATE` and `DELETE` operations are restricted exclusively to `service_role`. The `ip_hash` column MUST NEVER be published to client SELECT queries or Supabase Realtime WebSocket broadcasts.

## Security, Infrastructure & Performance Standards

### 1. HTTP Security Perimeter
Next.js middleware (`src/middleware.ts`) MUST inject security headers on every response:
- **Content-Security-Policy (CSP)**: `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; media-src 'self' https: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';`
- **HSTS**: `max-age=63072000; includeSubDomains; preload`
- **X-Frame-Options**: `DENY`
- **X-Content-Type-Options**: `nosniff`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=(), interest-cohort=()`

### 2. Media Compression & Asset Budget
- Photography: AVIF format preferred with WebP fallback, max dimension 1200px, quality 72, file size $\le 150\text{ KB}$.
- Audio: MP3 128kbps stereo, optimized for web streaming, total file size $\le 3\text{ MB}$.
- Arabic Fonts: Amiri font subsetting restricted to Unicode range `U+0600-06FF, U+FE70-FEFF` with total font payload $\le 30\text{ KB}$.
- Latin Fonts: Bodoni Moda and Jost self-hosted via `next/font/google` with `font-display: swap` and layout zero-shift metrics (CLS = 0).

### 3. Emergency Incident Control (Kill Switch)
If an automated bot attack or denial-of-service event bypasses Cloudflare Turnstile, the system MUST support an instant kill switch via `EMERGENCY_FEATURE_FLAGS` in `src/lib/config/wedding-data.ts`. Setting `isGuestbookFormActive: false` immediately closes submissions at the Server Action perimeter without touching the database.

## Development Workflow, Quality Gates & Release Protocol

### 1. The 5-Phase Engineering Loop
All engineering tasks (feature implementation, bug fixes, refactoring) MUST strictly execute via the 5-Phase Engineering Loop:
1. **Phase 1: Context & Discovery**:
   - Query codebase knowledge graph via `codebase-memory-mcp`.
   - **MANDATORY CONTEXT7**: During any planning, interview, or specification phase (`/grill-me`, `/brainstorming`, `/writing-plans`, `/speckit-plan`), engineers and agents MUST query `context7` (`resolve-library-id` followed by `query-docs`) to verify official API syntax, breaking changes, and configuration best practices. Never rely on stale LLM training data for framework APIs.
2. **Phase 2: Planning & Restraint (`/ponytail full`)**:
   - Enforce extreme minimalism (YAGNI, stdlib/native features over dependencies, zero bloat).
   - Produce a formal implementation plan and STOP for explicit user approval before touching code.
3. **Phase 3: Test-First Unit Testing**:
   - Write automated unit tests (`*.test.ts` / `*.test.tsx` via Vitest and React Testing Library) BEFORE writing implementation code.
   - Verify that tests fail (Red) for unbuilt functionality.
4. **Phase 4: Minimal Implementation**:
   - Write only the minimum code necessary to make all tests pass (Green).
   - Strictly honor SSoT `docs/DOKUMEN_TEKNIS/DESIGN.md` and `antislop` design guidelines.
   - Refactor cleanly without speculative abstractions.
5. **Phase 5: DoD & Quality Verification**:
   - Run all automated checks (`pnpm test`, `pnpm typecheck`, `pnpm lint`).
   - Validate that all 6 pillars of the Definition of Done are satisfied.

### 2. Mandatory Unit Testing per Feature
Every feature, mutation action, validation schema, security utility, and interactive component MUST have accompanying unit tests:
- **Security & Sanitization**: Verify `DOMPurify` HTML/SVG stripping, regex blocking of phishing URLs, and salted SHA-256 IP hashing.
- **Validation**: Verify Zod schemas for boundary conditions (name length 2–60, message length 3–500, pax 1–5, attendance enums).
- **Audio Logic & State**: Verify no autoplay on load, physical user gesture unlock, linear volume fade-in ramp (0.0 to 0.8 over 2.5s), and auto-pause on background tab.
- **UI Components**: Verify sentence case labels, `#FFFFFF` pure white background for QRIS modal, 1px divider lines for guestbook entries, and `prefers-reduced-motion` compliance.
- **Server Actions**: Verify Cloudflare Turnstile token validation, rate limiter enforcement (3 submissions / 10 min), and standardized `ActionResponse<T>` envelopes.

### 3. Pre-Commit Quality Gates (Definition of Done)
Every contribution, feature branch, or automated agent PR MUST pass all quality checks prior to approval:
1. **Automated Unit Tests**: `pnpm test` passes with 100% success rate.
2. **Type Safety**: `pnpm typecheck` (`tsc --noEmit`) passes with 0 errors (strict mode, zero `any`).
3. **Code Quality**: `pnpm lint` passes with 0 errors and 0 unused variable warnings.
4. **Design Compliance**: UI components match tokens and rules in `docs/DOKUMEN_TEKNIS/DESIGN.md` (correct Surakarta palette, 3 fonts, sentence case, no tracked uppercase, radius 2px for buttons, radius 4px for cards).
5. **Security Audit**: No credentials (`SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, `.env*`) exposed to client bundles or tracked in git; zero instances of `dangerouslySetInnerHTML`.
6. **Autoplay Compliance**: Audio components never attempt to execute `.play()` or `.resume()` outside an explicit user gesture.

### 4. Commit Standards
All git commits MUST follow the Conventional Commits specification:
`<type>(<scope>): <short imperative description>`
Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
Examples:
- `feat(opening): implement 3D envelope fold with Surakarta lung-lungan ornaments`
- `test(security): add test suite for phishing URL rejection and XSS sanitization`
- `fix(security): reject messages containing phishing URL patterns in submitRSVP`
- `docs(constitution): bump constitution to v1.1.0 with engineering loop and DoD`

## Governance

This Constitution represents the supreme architectural and technical contract for the **Bespoke Luxury Digital Wedding Invitation** project. It supersedes all informal discussions, ad-hoc suggestions, or conflicting template defaults.

1. **Hierarchy of Authority**:
   - `constitution.md` (Supreme Governance & Non-Negotiable Invariants)
   - `docs/DOKUMEN_TEKNIS/DESIGN.md` (Single Source of Truth for Visuals, Styling & Motion)
   - `docs/DOKUMEN_TEKNIS/PRD.md` (Functional Scope & User Journey)
   - Supporting technical docs (`TECH_STACK.md`, `ARCHITECTURE.md`, `DATABASE_ERD.md`, `API_DOCUMENTATION.md`, `CODING_STANDARD.md`, `SECURITY.md`).

2. **Amendment Procedure**:
   - Amendments to this constitution require a formal Spec Kit amendment workflow, documentation of technical trade-offs, and an impact report.
   - Any removal or loosening of core security or performance principles requires explicit project sponsor ratification.

3. **Versioning Policy**:
   - **MAJOR (X.0.0)**: Removal or breaking redefinition of core principles (e.g. changing security zero-trust model or design SSoT).
   - **MINOR (1.X.0)**: Addition of new principles, architectural components, or materially expanded compliance guidelines.
   - **PATCH (1.0.X)**: Typographical fixes, clarifying explanations, and non-semantic adjustments.

**Version**: 1.1.0 | **Ratified**: 2026-09-19 | **Last Amended**: 2026-09-19
