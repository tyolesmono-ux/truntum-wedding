# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 15 (App Router, React 19), TypeScript, Tailwind CSS, Motion (motion/react), Lenis, Supabase

## Users

- **Primary Users (Guests)**: Wedding guests receiving personalized invitation links via WhatsApp or Instagram on mobile browsers (iOS Safari, Android Chrome). Their goal is to experience the invitation, verify event schedules and locations, add the event to their calendar, RSVP with well-wishes, and send digital wedding gifts securely.
- **Secondary Users (Couple & Hosts)**: The couple and event organizers who need a prestigious, reliable digital representation of their wedding, effortless real-time tracking of guest RSVPs, and zero risk of banking info tampering or spam attacks.

## Product Purpose

A bespoke luxury digital wedding invitation web application that delivers a high-fashion editorial magazine experience (Kinfolk and Vogue aesthetics fused with Surakarta/Javanese royal heritage). Success is defined by:
1. An unforgettable 3D tactile opening ritual (envelope unfolding with monogram wax seal).
2. Refined, polite audio playback (linear volume fade-in upon user touch, floating rotating vinyl player).
3. Cultural and spiritual solemnity through sacred Quranic scripture (Ar-Rum: 21) and Surakarta batik philosophy.
4. Absolute financial and input security (immutable server-side gift constants, DOMPurify XSS sanitization, link blocking, Cloudflare Turnstile bot protection).
5. Flawless 60 FPS mobile performance across cellular network conditions.

## Positioning

Unlike mass-market template-based wedding invitation platforms that rely on generic carousels, intrusive popups, and vulnerable public database fields for banking info, this product is an ultra-bespoke, editorial-grade digital artifact. It combines high-fashion typography (Bodoni Moda & Jost), authentic Surakarta cultural motifs (Kawung, Truntum, Sogan palette), tactile physical-to-digital rituals, and bank-grade anti-tampering architecture.

## Operating Context

- **Entry Point**: Guests access the app via smartphone direct links with personal query parameters (e.g. `?to=Nama+Tamu`).
- **Discovery**: Preceded by dynamic OpenGraph card previews in messaging apps generated dynamically via `@vercel/og`.
- **Environment**: 95%+ mobile viewing (iPhone and Android) on varying cellular connections. Audio autoplay policies require explicit user touch gestures before initializing audio contexts.
- **Lifecycle**: Active before the wedding for RSVP collection and logistical planning, during the event for venue navigation, and post-event as a digital keepsake and guestbook archive.

## Capabilities and Constraints

- **Opening Gate**: 3D interactive virtual envelope with textured paper, guest name personalization, and clickable monogram wax seal that triggers smooth flap unfold and letter slide-out.
- **Floating Vinyl Audio Player**: Persistent floating player widget modeled after a rotating vinyl record with interactive play/pause and linear 2.5s audio fade-in. Strictly follows browser autoplay policies (no autoplay without user gesture).
- **Sacred Scripture & Blessings**: Staggered reveal of Surat Ar-Rum: 21 with high-resolution Amiri Arabic calligraphy, Indonesian translation, and traditional wedding prayers.
- **Couple Profile & Event Schedules**: Couple introductions, countdown timer to the wedding day, detailed Akad Nikah and Resepsi cards, one-click Add to Calendar (.ics, Google, Apple), and direct Google Maps / Waze venue navigation.
- **Editorial Love Story & Photo Gallery**: Scroll-linked vertical progress timeline and masonry photo gallery with touch-friendly Lightbox (swipe and pinch-to-zoom).
- **Hardened Digital Gift**: Display of official bank accounts and high-resolution QRIS modal with one-click copy. Built on immutable server-only constants (`src/lib/config/wedding-data.ts`); explicitly isolated from public database tables and mutable APIs.
- **RSVP & Live Guestbook**: Guest confirmation form (attendance status, pax 1–5, blessings) with Cloudflare Turnstile anti-bot verification, strict Zod schema validation, DOMPurify sanitization, and total rejection of URL/hyperlinks. Real-time updates delivered via Supabase WebSocket channels with canvas-confetti celebration.
- **Security & Headers**: Strict Content Security Policy (CSP), HSTS, anti-phishing regex, and in-memory rate limiting configured at middleware.

## Brand Commitments

- **Tone & Voice**: Warm, reverent, sophisticated, and courteous Bahasa Indonesia with classical Javanese elegance and authentic Arabic sacred typography.
- **Visual Heritage**: Royal Surakarta court aesthetics (Sogan Keraton `#6B4423`, Gading `#F6F1E7`, Wulung `#231F1B`, Prada Emas `#C2A05B`) harmonized with Didone editorial fashion layouts.
- **Naming & Identity**: Bespoke Luxury Digital Wedding Invitation (editorial showcase anchored around the Surakarta royal concept with customizable couple data).

## Evidence on Hand

- Complete technical documentation suite in [`docs/DOKUMEN_TEKNIS/`](./docs/DOKUMEN_TEKNIS/):
  - [`PRD.md`](./docs/DOKUMEN_TEKNIS/PRD.md): Detailed product requirements and feature journeys.
  - [`DESIGN.md`](./docs/DOKUMEN_TEKNIS/DESIGN.md) & [`DESIGN.md`](./DESIGN.md): Design tokens, typography hierarchy, component styling rules, and layout pacing.
  - [`TECH_STACK.md`](./docs/DOKUMEN_TEKNIS/TECH_STACK.md): Dependency specifications, bundle limits, and library justifications.
  - [`ARCHITECTURE.md`](./docs/DOKUMEN_TEKNIS/ARCHITECTURE.md): Component topology, envelope lifecycle, and audio state machine.
  - [`DATABASE_ERD.md`](./docs/DOKUMEN_TEKNIS/DATABASE_ERD.md): Database schema, migration script, and Supabase RLS policies.
  - [`API_DOCUMENTATION.md`](./docs/DOKUMEN_TEKNIS/API_DOCUMENTATION.md): Server Actions, OpenGraph generator, and WebSocket patterns.
  - [`CODING_STANDARD.md`](./docs/DOKUMEN_TEKNIS/CODING_STANDARD.md): TypeScript strict standards and 60 FPS animation rules.
  - [`SECURITY.md`](./docs/DOKUMEN_TEKNIS/SECURITY.md): Threat modeling, CSP headers, and anti-tampering architecture.
- Showcase content: Romeo & Juliet couple sample data, Surat Ar-Rum: 21 verses, mock BCA/Mandiri account configs. Real client photographs, audio tracks, and official QRIS asset will be vendor-supplied before production deployment.

## Product Principles

1. **Tactile Digital Ceremony**: The transition from link to invitation must feel like opening a physical, hand-crafted envelope—tactile, graceful, and deliberate.
2. **Sacred Cultural Reverence**: Islamic verses and Surakarta heritage symbols are treated with deep respect and restrained poise, never as superficial decoration.
3. **Zero-Trust Financial Protection**: Gift and banking data are hardened against tampering and injection by architectural guarantee; security cannot be compromised for convenience.
4. **Mobile Performance as Hospitality**: Respect the guest's device and connection through CLS 0, sub-90 KB initial JS, and silky 60 FPS animations.
5. **Actionable Simplicity**: All critical wedding logistics (time, location, calendar sync, RSVP) are scannable and achievable in a single tap.

## Accessibility & Inclusion

- Adherence to WCAG AA contrast standards for all essential textual information (schedules, venue addresses, banking numbers).
- Minimum $44 \times 44\text{ px}$ touch targets across all mobile interactive components (wax seal, audio toggle, copy buttons, form elements).
- Semantic HTML tags and descriptive ARIA labels across modal dialogues, live announcements, and audio states.
- Respect for `prefers-reduced-motion` preferences with reduced motion fallbacks for heavy 3D envelope transitions.
