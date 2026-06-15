## What this PR does
This PR introduces a comprehensive "Re-run & Detect" feature for StackAudit. It automatically detects when AI tool pricing changes, emails the affected users, and provides them a direct rerun link in the email to re-run their audits and see a side-by-side comparison of how their savings were impacted by the price updates.

## Why
Pricing for AI tools changes rapidly, meaning an audit run last month might be giving outdated advice today. By proactively notifying users of price changes and showing them exactly how it affects their bottom line, we increase user trust and retention. Since it is frustrating for users to manually re-enter their tools from scratch, the re-run flow automatically pre-fills their previous configuration. It also gives users the option to either update their existing audit or create a new one, providing full control over how their data is saved.

## How it works
1. **Detection & Email:** A cron-triggered endpoint (`/api/detect-changes/route.ts`) compares the latest `TOOLS_CONFIG` with the `pricing_snapshot` stored in the Supabase `audits` table. It recalculates the audit, checks if the savings have changed, and uses native `fetch` (via Resend) to send consolidated HTML emails (`src/lib/email-templates.ts`) to affected users. Finally, it flags the database row with `pricingOutdated = true`.
2. **Re-run Flow:** When users click the link in the email, they arrive at their audit and see a warning banner. Clicking "Re-run" pre-fills the form (`AuditFormPage.tsx`) and opens an `UpdateModeModal`, which lets them choose whether to overwrite their old audit or create a new one.
3. **Diff View:** When the new audit runs, it temporarily saves the old recommendations. The `AuditResultPage.tsx` then displays `DiffView.tsx` at the top. This provides a clean, two-column comparison of their old and new spending and savings, while neatly collapsing any unchanged tools. The DiffView detects both savings changes and spend changes — so a $100→$1000 price jump is properly surfaced even if both audits had $0 potential savings.
4. **Cross-Tool Intelligence:** The audit engine now includes two new rules beyond the original within-tool optimisations: (a) **Price Spike Detection** flags when a plan is ≥1.5x more expensive than a cheaper alternative within the same tool, and (b) **Cross-Tool Comparison** groups tools into categories (AI assistants, IDE coding tools, LLM APIs) and recommends switching to a competitor if it's ≥2x cheaper for equivalent work.
5. **Local-first Architecture:** localStorage is always the source of truth for audit data. The Supabase DB is used for shared links, persistence, and syncing the `pricingOutdated` flag from the cron job — it never overwrites local data. This prevents re-run results from being reverted when navigating back and forth.

## What I cut
*   **Unsubscribe Links:** I skipped adding unsubscribe functionality or database opt-out flags. The effort required outweighed the value right now, and Resend's free tier restrictions made it too complicated to implement perfectly within the timeframe. I chose to focus on the core Diff View UX instead.
*   **Historical Pricing Database:** Rather than building a complex database to track pricing history, I used a simple `pricing_snapshot` JSONB column on the audit row. We simply compare the current `TOOLS_CONFIG` to this snapshot. I made this cut purely due to time constraints.

## How to test it manually

### Prerequisites
1. **Environment Variables:** Ensure you have a `.env.local` file with your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `RESEND_API_KEY`.
2. **Database Setup:** Go to your Supabase SQL Editor and run `ALTER TABLE audits DISABLE ROW LEVEL SECURITY;` to allow the app to save audits without authentication.

### Testing the flow
1. **Run an initial audit:** Go to `/audit`, add "Gemini" (Pro, $19.99/mo), fill in an email address (make sure it's verified in Resend if you're on the free tier), and click "Run my audit".
2. **Simulate a price change:** Open `src/lib/tools-config.ts` and manually change the price of Gemini Pro to `$199.99`.
3. **Trigger detection:** Open `http://localhost:3000/api/detect-changes` in your browser. It's a GET request, so no cURL or Postman needed.
4. **Verify Email & UI:** Check your Resend logs (or your inbox) to confirm the HTML update email was sent. Alternatively, go to the "All Audits" page (`/result`) — you should automatically see an orange **OUTDATED PRICES** badge appear.
5. **View Diff & Cross-Tool Recs:** Click the re-run link in the email (or click the audit from the history page). You will see the "Pricing data has changed" banner. Click "Re-run", submit the pre-filled form, select "Update existing", and check that the side-by-side `DiffView` correctly surfaces the huge spend increase. You will also see the new Cross-Tool Intelligence recommend switching to a cheaper alternative like Claude or ChatGPT!

## What's tested
*   I didn't add automated tests due to time constraints, prioritising the end-to-end user flow and fixing UI bugs over test coverage.
*   If I had more time, here is what I would test first:
    *   **Unit test for Diff logic:** Test the `buildDiffRows` function in `DiffView.tsx` using mocked `oldRecs` and `newRecs`. This would ensure the `improved`, `worse`, `new`, and `removed` statuses always calculate the deltas perfectly — including the new spend-change detection.
    *   **Cross-tool comparison:** Test the new `TOOL_CATEGORIES` grouping and price comparison logic in `audit-engine.ts` to verify it correctly recommends cheaper alternatives across tools.
    *   **Mocking the API:** Write a test for `/api/detect-changes` that mocks the `fetch` call to Resend. This would verify that it correctly groups multiple outdated audits for a single user into one consolidated email.
    *   **Form State:** Add a small integration test to ensure the new `UpdateModeModal` properly passes either the `compare=true` flag or a `diffWith` ID, depending on the user's choice.

## Open questions / risks
*   **Cron Job Scaling:** The `/api/detect-changes` endpoint currently fetches *all* audits into memory for comparison. If this went to production, we would need to paginate the database query or move this heavy lifting to a background queue to handle user growth.
*   **Resend Free Tier Limits:** The app currently uses a hardcoded "From" address and is subject to Resend's strict unverified domain sandbox limits. This means email dispatch could silently fail in production if an unauthorised email is used, without showing proper errors in the UI.
*   **Supabase RLS:** Row Level Security must be disabled on the `audits` table for anonymous writes to work. In production, this should be replaced with proper RLS policies (e.g. allow inserts/updates for authenticated users or service-role only).