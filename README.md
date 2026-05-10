# StackAudit

**StackAudit is the free AI spend auditor for startups.** You tell us which AI tools your team uses (Cursor, Claude, ChatGPT, Copilot, and more) and how much you pay. We surface where you're overpaying, recommend smarter alternatives, and generate an AI-powered summary of your stack — in under 3 minutes.

Built as part of the [Credex](https://credex.ai) ecosystem.

---

## Screenshots

> _Screenshots / screen recording will be added after the first deployed build._
>
> Placeholder sections:
> - Landing page hero
> - Audit form (tool selection + spend inputs)
> - Audit results (hero savings + per-tool breakdown + AI summary)

---

## Quick Start

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install & run locally

```bash
git clone https://github.com/your-org/stackaudit.git
cd stackaudit
npm install
npm run dev
```

App runs at **http://localhost:3000**.

### Environment variables

Create `.env.local` in the project root:

```env
# Required for AI summary generation (Feature 4)
ANTHROPIC_API_KEY=sk-ant-...

# Required for lead capture storage (Feature 5) — pick one backend
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Required for transactional email (Feature 5)
RESEND_API_KEY=re_...
```

### Deploy

The project is a standard Next.js app. Recommended: **Vercel** (zero-config).

```bash
# Vercel CLI
npx vercel
```

> Deployed URL: _TBD — will be added after first production deploy._

---

## Project Structure

```
src/
├── app/                  # Next.js App Router routes
│   ├── page.tsx          # / — Landing page
│   ├── audit/page.tsx    # /audit — Spend input form
│   └── result/page.tsx   # /result — Audit results
├── features/             # Full-page feature modules
│   ├── LandingPage.tsx
│   ├── AuditForm/
│   │   ├── AuditFormPage.tsx   # Form orchestrator
│   │   └── ToolCard.tsx        # Per-tool toggle + inputs
│   └── AuditResult/
│       ├── AuditResultPage.tsx  # Result orchestrator + placeholder engine
│       ├── HeroSavings.tsx      # Big monthly/annual savings banner
│       ├── ToolRecommendationCard.tsx
│       ├── AiSummaryCard.tsx
│       └── LeadCaptureSection.tsx
├── components/           # Shared UI primitives
│   ├── NavBar.tsx
│   └── Footer.tsx
├── hooks/
│   └── useAuditForm.ts   # Form state + localStorage persistence
└── lib/
    ├── types.ts           # Shared TypeScript interfaces
    ├── tools-config.ts    # Tool definitions & plan options
    └── ai-summary.ts      # AI summary generator (stub → Anthropic SDK)
```

### Convention

| Layer | What goes here |
|---|---|
| `app/` | Thin route files — metadata only, no logic |
| `features/` | Page-level components and their private sub-components |
| `components/` | Reusable primitives used across multiple features |
| `hooks/` | Custom React hooks with no UI |
| `lib/` | Pure functions, config, and type definitions |

---

## Features (MVP)

| # | Feature | Status |
|---|---|---|
| 1 | Spend input form (8 tools, localStorage persist) | ✅ Done |
| 2 | Audit engine (rule-based, defensible logic) | 🔲 Placeholder in place |
| 3 | Audit results page (hero savings + per-tool breakdown) | ✅ Done (needs engine) |
| 4 | AI-generated personalised summary (Anthropic API) | 🔲 Stub in `src/lib/ai-summary.ts` |
| 5 | Lead capture + storage (email → Supabase + Resend) | 🔲 UI done, backend TBD |
| 6 | Shareable result URL (OG tags) | 🔲 OG metadata in place, unique URL TBD |

---

## Decisions

### 1. localStorage for form persistence (not a database)
The form must survive page refreshes without requiring login. Using `localStorage` in a custom hook (`useAuditForm`) achieves this without any backend round-trip. A server-side draft system would add complexity for no user benefit at MVP stage.

### 2. Feature folders, not layer folders
Components are co-located with the feature they belong to (`features/AuditForm/ToolCard.tsx`) rather than a flat `components/` directory. This makes it obvious what can be deleted when a feature is removed, and prevents premature abstraction.

### 3. Audit engine logic is hardcoded rules, not AI
Per the product spec: "the audit math itself — hardcoded rules are correct — knowing when *not* to use AI is part of the test." The engine evaluates plan-fit and seat utilisation using deterministic logic. AI is only used for the 100-word summary paragraph.

### 4. Next.js App Router (not Pages Router)
Next.js 16 defaults to the App Router. Route files are kept as thin wrappers (metadata + one component import) so that all rendering logic lives in `features/` and is portable if the routing layer changes.

### 5. Tailwind CSS v4 via `@import "tailwindcss"`
The project uses Tailwind v4's new CSS-first config (no `tailwind.config.js`). This removes a config file and keeps all design tokens in `globals.css`, reducing the number of files a new contributor needs to touch.

---

## Roadmap (post-MVP)

- Wire real audit engine rules (PRICING_DATA.md as source of truth)
- Wire Anthropic API in `src/lib/ai-summary.ts`
- Supabase lead storage + Resend transactional email
- Unique shareable result URLs (UUID in URL, strip PII for public view)
- Rate limiting / hCaptcha on lead capture endpoint
- PDF export of audit report

---

## License

MIT © 2026 StackAudit / Credex
