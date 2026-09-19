<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, load the antislop skill for the task:
- Core filter, always on: `antislop`
- UI / visual: `antislop-ui`
- Copy & text: `antislop-copywriting`
- Mobile / responsive: `antislop-layoutmobile`
- Code comments: `antislop-code`
- People: `antislop-human`
Before starting, ask the user when antislop applies: during the work, or after it is done.
<!-- antislop:end -->

# Universal AI Agent Guidelines (AGENTS.md)
## Bespoke Luxury Digital Wedding Invitation

This document establishes the mandatory operational rules, architectural invariants, and design guidelines for **ANY** AI coding agent (Claude, Cursor, Copilot, Codex, Roo, Windsurf, Antigravity, etc.) interacting with this codebase.

---

## 1. Authority & Documentation Hierarchy

All decisions MUST defer to the following hierarchy of authority:

1. **Constitution** ([`.specify/memory/constitution.md`](./.specify/memory/constitution.md)): Supreme architectural and governance contract. Non-negotiable.
2. **Design SSoT** ([`docs/DOKUMEN_TEKNIS/DESIGN.md`](./docs/DOKUMEN_TEKNIS/DESIGN.md)): Single Source of Truth for all visual design, colors, typography, layout, spacing, and motion.
3. **Product Requirements** ([`docs/DOKUMEN_TEKNIS/PRD.md`](./docs/DOKUMEN_TEKNIS/PRD.md)): User journey, feature boundaries, and platform constraints.
4. **Technical Specifications** ([`docs/DOKUMEN_TEKNIS/`](./docs/DOKUMEN_TEKNIS/)):
   - [`TECH_STACK.md`](./docs/DOKUMEN_TEKNIS/TECH_STACK.md): Pustaka, token CSS, dan dependensi target.
   - [`ARCHITECTURE.md`](./docs/DOKUMEN_TEKNIS/ARCHITECTURE.md): Topologi komponen, audio state, dan realtime flow.
   - [`DATABASE_ERD.md`](./docs/DOKUMEN_TEKNIS/DATABASE_ERD.md): Skema PostgreSQL, RLS policies, dan `schema.sql`.
   - [`API_DOCUMENTATION.md`](./docs/DOKUMEN_TEKNIS/API_DOCUMENTATION.md): Server Actions, `/api/og`, dan WebSockets.
   - [`CODING_STANDARD.md`](./docs/DOKUMEN_TEKNIS/CODING_STANDARD.md): Aturan TypeScript ketat dan konvensi penulisan kode.
   - [`SECURITY.md`](./docs/DOKUMEN_TEKNIS/SECURITY.md): Pemodelan ancaman, proteksi XSS, Turnstile, dan CSP.

---

## 2. Non-Negotiable Core Invariants (Zero-Tolerance Rules)

### 2.1 Financial Data Hardening (Anti-Tampering)
- **NEVER** store bank accounts (BCA, Mandiri) or QRIS metadata in database tables, mutable storage, or public APIs.
- Financial gift details are strictly defined as immutable, server-only constants in `src/lib/config/wedding-data.ts` (`as const`).
- The QRIS display modal MUST use a pure white background (`#FFFFFF`) to guarantee camera scanner decodability.

### 2.2 Input Sanitization & Anti-XSS (Zero-Trust Input)
- **NEVER** render raw user input with `dangerouslySetInnerHTML`. Render strictly via React text interpolation (`<p>{wish.message}</p>`).
- All guestbook inputs MUST be sanitized via `DOMPurify` on the server before database insertion.
- Incoming messages MUST be evaluated against URL regex patterns (`/(https?:\/\/|www\.|\.com|\.org|\.net|\.id|\.xyz|bit\.ly|t\.me)/i`). Any message containing a link MUST be rejected immediately.
- Form submissions require valid Cloudflare Turnstile token verification and sliding-window rate limiting (max 3 submissions per IP per 10 minutes) with salted SHA-256 IP hashing.

### 2.3 Audio Autoplay Policy Compliance
- **NEVER** trigger audio playback or call `audioContext.resume()` on initial page load.
- Audio playback MUST be unlocked exclusively by a physical user gesture (clicking/touching the wax seal on `WaxSeal.tsx`).
- Volume ramp MUST use Web Audio API `linearRampToValueAtTime` from `0.0` to `0.8` over 2.5 seconds.
- Audio MUST automatically pause when `document.visibilityState === 'hidden'` to preserve battery and mobile data.

### 2.4 Mobile-First 60 FPS Performance
- Primary target: 390×844 (iPhone 12/13/14) viewport, responsive up to 480px (mobile) and 720px (desktop center).
- Initial JavaScript bundle MUST NOT exceed 90 KB gzipped. Components below the fold (Gallery, Gift, RSVP) MUST use dynamic imports (`next/dynamic`).
- Only GPU-composited properties (`transform: translate3d/rotate3d`, `opacity`) may be animated. Animating layout properties (`top`, `left`, `margin`, `width`) is forbidden, with the singular exception of guestbook realtime entry insertion (`height: 0 → auto`, 240ms).

---

## 3. Design System & Anti-Slop Guidelines (SSoT: `DESIGN.md`)

When writing, editing, or generating UI components:

1. **Color Tokens**: Use ONLY the Surakarta editorial palette:
   - Backgrounds: Gading Keraton (`#F6F1E7` / `--bg`), Melati (`#FCFAF5` / `--surface`), Kertas Batik (`#E8DCC8` / `--surface-alt`), Malam Wulung (`#15120F` / `--bg-dark`).
   - Typography: Wulung (`#231F1B` / `--fg`), `--fg-body` (`#4A3E33`), `--fg-muted` (`#8A7862`).
   - Brand & Accents: Sogan Tua (`#6B4423` / `--brand`), Prada Emas (`#C2A05B` / `--gold`), Cinde (`#8C2F27` / `--accent`), Gadung Mlati (`#7E8C74` / `--success`).
   - Prada Emas (`#C2A05B`): Maximum 5% of screen area; **FORBIDDEN for text body** due to contrast ratios.
2. **Typography Rules**:
   - Exactly 3 font families: **Bodoni Moda** (Display & Headings $\ge 22\text{px}$), **Jost** (Body, UI, Data, Buttons), **Amiri** (Quranic Arabic subset).
   - **NO script, handwriting, or novelty fonts**.
   - **Sentence case** for ALL labels, headings, and buttons. **NO tracked uppercase eyebrow labels**.
3. **Anti-Template Patterns**:
   - NO full-color batik background textures (use Kawung 5% subtle SVG opacity only where specified).
   - NO card-list stacking in guestbook (use subtle 1px `--line` dividers).
   - NO hover effects or soft card elevation shadows.
   - NO fade-up animations on every section. Section reveal animations are restricted **ONLY** to the Sacred Verse and Love Story sections.

---

## 4. Engineering Standards & Quality Gates

1. **TypeScript**: Strict mode enabled. Absolute ban on `any` and loose casting. Use Zod schemas for all external or runtime inputs.
2. **Next.js 15**: React Server Components (RSC) by default. Use `'use client'` only on interactive leaf components.
3. **Pre-Completion Quality Checks**:
   Every agent MUST run and verify the following commands before completing any implementation task:
   ```bash
   pnpm typecheck   # Must exit with 0 errors
   pnpm lint        # Must exit with 0 warnings/errors
   ```
4. **Git Commits**: Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `perf:`, `refactor:`, `style:`, `test:`, `chore:`).
