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

# Antigravity Agent Guidelines (GEMINI.md)
## Bespoke Luxury Digital Wedding Invitation

This document defines specialized instructions, tool conventions, and skill workflows specifically tailored for **Google Antigravity (AGY)** pair-programming in this project.

---

## 1. Project Context & Invariants

You are assisting in building an ultra-bespoke, high-fashion editorial digital wedding invitation (*Kinfolk/Vogue* meets Royal Surakarta heritage).

Before taking any action, you MUST honor the project governance:
- **Constitution**: [`.specify/memory/constitution.md`](./.specify/memory/constitution.md) (Supreme governance)
- **Design SSoT**: [`docs/DOKUMEN_TEKNIS/DESIGN.md`](./docs/DOKUMEN_TEKNIS/DESIGN.md) (Single Source of Truth for visual styling, colors, typography, and motion)
- **Universal Agent Rules**: [`AGENTS.md`](./AGENTS.md) (Anti-tampering, sanitization, 60 FPS, autoplay invariants)

---

## 2. MCP Tooling & Protocol Requirements

### 2.1 Codebase Knowledge Graph (`codebase-memory-mcp`)
This project maintains a codebase knowledge graph. **ALWAYS** prefer MCP graph tools over raw grep/glob for code discovery:
1. `search_graph`: Find functions, classes, routes, components, or variables by pattern.
2. `trace_path`: Trace call chains (inbound callers or outbound dependencies).
3. `get_code_snippet`: Read specific function or component definitions.
4. `check_index_coverage`: Validate candidate paths and check for unindexed ranges before making negative or exhaustive claims.
5. `query_graph`: Execute Cypher queries for complex structural patterns.

*When to fall back to grep/glob*: Searching string literals, configuration files, environment keys, error messages, or non-code files.

### 2.2 Live Documentation Lookup (`context7`)
Use the `context7` MCP server to fetch up-to-date documentation before implementing code with modern frameworks:
1. Call `resolve-library-id` with the library name (e.g. `next`, `react`, `motion`, `lenis`, `supabase`, `tailwindcss`, `@cloudflare/turnstile`).
2. Call `query-docs` using the resolved ID (e.g. `/vercel/next.js`, `/supabase/supabase`) scoped to specific concepts (e.g. Server Actions, Realtime CDC channels, Web Audio API, or Lenis configuration).

---

## 3. Specialized Skills Protocol

Antigravity is equipped with specialized skills. Activate them according to task requirements:

| Kondisi / Jenis Pekerjaan | Skill yang Digunakan | Peran & Tindakan Wajib |
| :--- | :--- | :--- |
| **Pekerjaan UI, Komponen & Visual** | `impeccable` + `antislop-ui` | Pastikan seluruh komponen mematuhi SSoT [`docs/DOKUMEN_TEKNIS/DESIGN.md`](./docs/DOKUMEN_TEKNIS/DESIGN.md). Wajib: palet Surakarta (`#F6F1E7`, `#6B4423`, `#C2A05B`), 3 font (`Bodoni Moda`, `Jost`, `Amiri`), *sentence case*, dan pencegahan elemen template generik. |
| **Penulisan Teks, Copywriting & Doa** | `antislop-copywriting` | Bahasa Indonesia formal dan santun (*"Kepada Bapak/Ibu/Saudara"*, *"Buka undangan"*, *"Nomor rekening tersalin"*). Larangan ALL CAPS ter-tracking. |
| **Penyederhanaan & Anti-Overengineering** | `ponytail` | Utamakan kesederhanaan ekstrim (*lazy mode*, YAGNI). Gunakan native platform API dan pustaka standar sebelum menambahkan abstraksi berlebih. |
| **Alur Spesifikasi Fitur** | `speckit-*` | Gunakan alur Spec Kit (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`) untuk pengembangan fitur terstruktur. |
| **Investigasi Masalah & Bug** | `systematic-debugging` | Lakukan investigasi akar masalah (*root-cause*) sebelum mengusulkan modifikasi kode. |
| **Verifikasi Sebelum Klaim Selesai** | `verification-before-completion` | Jalankan `pnpm typecheck` dan `pnpm lint` di terminal dan periksa outputnya sebelum menyatakan tugas selesai. |

---

## 4. Planning Mode & Artifact Workflow

1. **When to Plan**:
   If a task involves non-trivial architectural changes, creating new components, or modifying application state, enter **Planning Mode**:
   - Research thoroughly using MCP graph tools and docs. Do not modify source code during research.
   - Create or update `implementation_plan.md` in `<appDataDir>/brain/<conversation-id>/implementation_plan.md` with `user_facing: true` and `request_feedback: true`.
   - **STOP** and wait for explicit user approval before executing changes.
2. **Post-Execution Walkthrough**:
   After executing an approved plan and passing automated verification (`typecheck` & `lint`), create or update `walkthrough.md` in the artifact directory detailing the changes and validation results.

---

## 5. Communication & Formatting Standards

1. **Clickable Links**: You **MUST** format all file references as clickable Markdown links using the `file:///` scheme (e.g. [`DESIGN.md`](file:///home/disnakerska/Documents/Project/luxury-wedding-invitation/docs/DOKUMEN_TEKNIS/DESIGN.md)).
2. **Language**: Respond concisely in fluent, polite Bahasa Indonesia when addressed by the user in Indonesian, maintaining an editorial and professional tone.
3. **LaTeX Math**: Use KaTeX syntax (`\(...\)` for inline math, `\[...\]` for display math) only when explaining mathematical/physics calculations (e.g. spring easing, frame rate calculations).
