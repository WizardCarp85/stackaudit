# StackAudit

**StackAudit is a free AI spend auditor designed for startups to optimize their tool sprawl.** It analyzes your team's AI tool usage (Cursor, Claude, ChatGPT, etc.) to identify over-provisioned seats and recommend cost-saving alternatives in under 3 minutes.

---

## Screenshots / Demo

> [!NOTE]
> 3+ screenshots or a 30-second screen recording (YouTube/Loom link) will be placed here.
>
> 1. **Landing Page**: The hero section and tool selection.
> 2. **Audit Form**: The seat count and plan selection interface.
> 3. **Audit Results**: The savings dashboard and AI-generated summary.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### 3. Deploy
The project is optimized for **Vercel**.
```bash
npx vercel
```

---

## Decisions

### 1. localStorage vs Database for Audit History
**Decision:** Store audit results and form state in `localStorage`.
**Trade-off:** We prioritized a frictionless, "no-login" experience for the MVP. While this means users can't share results across devices easily, it removes the need for Auth/Database infrastructure, drastically reducing time-to-value for new users.

### 2. Deterministic Engine vs AI for Audit Math
**Decision:** Use hardcoded pricing rules and seat-logic instead of LLMs for the core audit.
**Trade-off:** Knowing *when not* to use AI is critical for credibility. Using deterministic rules ensures 100% accuracy in cost calculations, whereas an LLM might hallucinate pricing data. AI is reserved strictly for the qualitative summary paragraph.

### 3. Feature-first vs Layer-based Organization
**Decision:** Components are co-located within `src/features/` rather than a global `src/components/` folder.
**Trade-off:** This makes features self-contained and easier to delete or refactor. The trade-off is a slight increase in duplication for small UI primitives, but it prevents the "spaghetti component" problem common in early-stage startups.

### 4. Client-side vs Server-side Audit Execution
**Decision:** Execute the audit engine entirely in the browser.
**Trade-off:** This provides instant results with zero network latency. The trade-off is that pricing logic is exposed in the client bundle. For the MVP, the speed of the user experience outweighs the need to protect the proprietary math.

### 5. Tailwind CSS v4 CSS-first Config
**Decision:** Adopted Tailwind v4 with `@import "tailwindcss"` in `globals.css`.
**Trade-off:** This removes the `tailwind.config.js` file and keeps all design tokens in standard CSS. It simplifies the build pipeline but requires contributors to be familiar with the new v4 syntax.

---

## Deployed URL

> [!IMPORTANT]
> **Live Demo:** [https://stackaudit-one.vercel.app/](https://stackaudit-one.vercel.app/)
