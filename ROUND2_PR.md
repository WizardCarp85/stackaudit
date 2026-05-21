## What this PR does
This PR introduces a comprehensive "Re-run & Detect" engine for StackAudit. It automatically detects when AI tool pricing changes, emails affected users, and provides a seamless UI for them to re-run their audits and see a side-by-side comparison of how their savings were impacted by the price updates.

## Why
Pricing for AI tools changes rapidly, meaning an audit run last month might be giving outdated advice today. By proactively notifying users of price changes and showing them exactly how it affects their bottom line, we increase user trust and retention. We assumed that users don't want to re-enter all their tools from scratch, so the re-run flow pre-fills their previous configuration.

## How it works
1. **Detection & Email:** A cron-triggered endpoint (`/api/detect-changes/route.ts`) compares the latest `TOOLS_CONFIG` against the `pricing_snapshot` stored in the Supabase `audits` table. It recalculates the audit, identifies if savings changed, and uses native `fetch` (via Resend) to send consolidated HTML emails (`src/lib/email-templates.ts`) to affected users. It then flags the DB row as `pricingOutdated = true`.
2. **Re-run Flow:** Users clicking the email link arrive at their audit with a warning banner. Clicking "Re-run" pre-fills the form (`AuditFormPage.tsx`) and presents an `UpdateModeModal` allowing them to either overwrite the old audit or fork a new one.
3. **Diff View:** When the new audit executes, it saves a temporary snapshot of the old recommendations. The `AuditResultPage.tsx` then renders `DiffView.tsx` at the top, showing a clean two-column, side-by-side comparison of their old vs. new spend and savings, with unchanged tools neatly collapsed.

## What I cut
*   **Unsubscribe Links:** I didn't add unsubscribe functionality or database opt-out flags because the value/effort ratio favored focusing on the core Diff View UX first, and Resend free tier restrictions made full list management overkill for this stage.
*   **Historical Pricing Database:** Instead of building a complex versioned pricing database, I opted for a simpler `pricing_snapshot` JSONB column on the audit row. We simply compare current `TOOLS_CONFIG` to the row's snapshot.
*   **Resend SDK:** I cut the official `resend` Node SDK dependency and instead used native `fetch` to keep the bundle size small and avoid strict sandbox environment issues.

## How to test it manually
1. **Run an initial audit:** Go to `/audit`, add "Cursor" (Pro, $20/mo), fill in an email, and click "Run my audit".
2. **Simulate a price change:** Open `src/lib/tools-config.ts` and manually change Cursor Pro's price to `$30`.
3. **Trigger detection:** Manually trigger a POST to `/api/detect-changes` via cURL or Postman.
4. **Verify Email:** Check your Resend logs (or your verified inbox) to ensure the HTML update email was dispatched.
5. **View Diff:** Click the re-run link in the email (or just go to your result page). You will see the "Pricing data has changed" banner. Click "Re-run", submit the pre-filled form, select "Update existing", and verify the side-by-side `DiffView` shows the change in your savings delta.

## What's tested
*   *I skipped adding automated tests for the email dispatch endpoint and DiffView components due to time constraints, focusing on shipping the end-to-end user flow.*
*   If I had more time, I would first test:
    *   Unit tests for `buildDiffRows` in `DiffView.tsx` to ensure `improved`, `worse`, `new`, and `removed` statuses calculate correctly.
    *   Mocking the `fetch` call in `/api/detect-changes` to ensure it correctly groups multiple outdated audits for a single user into one email.

## Open questions / risks
*   **Cron Job Scaling:** The `/api/detect-changes` endpoint currently fetches *all* audits into memory to compare them. If this shipped to production, we would need to paginate this database query or move the heavy lifting to an asynchronous queue as the user base grows.
*   **Resend Free Tier Limits:** The application currently relies on a hardcoded "From" address and is subject to strict unverified domain sandbox limits, which could silently fail if an unauthorized email is submitted in production without proper error surfacing to the UI.
