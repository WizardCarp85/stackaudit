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

## How to test it manually
1. **Run an initial audit:** Go to `/audit`, add "Cursor" (Pro, $20/mo), fill in an email, and click "Run my audit".
2. **Simulate a price change:** Open `src/lib/tools-config.ts` and manually change Cursor Pro's price to `$30`.
3. **Trigger detection:** Manually trigger a POST to `/api/detect-changes` via cURL or Postman.
4. **Verify Email:** Check your Resend logs (or your verified inbox) to ensure the HTML update email was dispatched.
5. **View Diff:** Click the re-run link in the email (or just go to your result page). You will see the "Pricing data has changed" banner. Click "Re-run", submit the pre-filled form, select "Update existing", and verify the side-by-side `DiffView` shows the change in your savings delta.

## What's tested
*   *Honest disclosure: I skipped adding automated tests for the new DiffView components and the centralized pricing/re-run logic due to time constraints. I prioritized shipping the end-to-end user flow and fixing UI bugs over test coverage.*
*   If we had more time, here is exactly what I'd test first:
    *   **Unit test for Diff logic:** Test the `buildDiffRows` function in `DiffView.tsx` with mocked `oldRecs` and `newRecs` to ensure the `improved`, `worse`, `new`, and `removed` statuses calculate the deltas perfectly every time.
    *   **Mocking the API:** Write a test for `/api/detect-changes` that mocks the native `fetch` call to Resend, verifying it correctly groups multiple outdated audits for a single user into one consolidated email payload.
    *   **Form State:** Add a small integration test ensuring that the new `UpdateModeModal` properly passes the `compare=true` flag versus a `diffWith` ID based on the user's choice.

## Open questions / risks
*   **Cron Job Scaling:** The `/api/detect-changes` endpoint currently fetches *all* audits into memory to compare them. If this shipped to production, we would need to paginate this database query or move the heavy lifting to an asynchronous queue as the user base grows.
*   **Resend Free Tier Limits:** The application currently relies on a hardcoded "From" address and is subject to strict unverified domain sandbox limits, which could silently fail if an unauthorized email is submitted in production without proper error surfacing to the UI.
