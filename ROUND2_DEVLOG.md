## 2026-05-20 09:00 - Start
Read the Round 2 assignment. The core requirements are background pricing checks, emails, and a diff view. I'm going to map out the Supabase changes first.

## 2026-05-20 09:45 - DB Schema approach
Decided to just add `pricing_snapshot` (JSONB) to the existing `audits` table rather than building a separate relational pricing history system. It's much faster to just snapshot the config at the exact moment they run the audit.

## 2026-05-20 11:30 - Supabase struggles
Wasted an hour fighting with Supabase RLS policies and type generation. Finally got the `pricing_snapshot` column saving properly when an audit is created.

## 2026-05-20 13:00 - The Detect endpoint
Built `/api/detect-changes`. The logic to deeply compare the snapshot against `TOOLS_CONFIG` is tricky. Opted for a simple recalculation approach: just feed the old form state into the engine using the *new* prices and check if the total savings changed.

## 2026-05-20 14:15 - Resend SDK Blockers
Hit a major blocker. Tried to run `npm install resend` but the sandbox environment kept failing the install due to strict permission errors. 

## 2026-05-20 15:00 - Native Fetch Workaround
Realized I don't actually need the Resend SDK. Just ripped it out and used native `fetch("https://api.resend.com/emails")`. It worked immediately and kept the bundle size down anyway. Win-win.

## 2026-05-20 16:30 - Sandbox Limitations
Ran into the Resend free tier sandbox limitation. I can only send emails to verified addresses. Added a clear comment in the code and decided to just proceed with manual testing against my own email address rather than trying to set up domain verification in this timeframe.

## 2026-05-20 18:00 - Email Templates
Built `src/lib/email-templates.ts`. Wrote a clean HTML template using inline styles to ensure it renders correctly in Gmail. Grouped the updates by user email so we only send one email per person, not one per tool.

## 2026-05-20 20:30 - The Re-run Modal
Started on the UI. Built `UpdateModeModal.tsx` to handle the choice between overwriting the old audit or creating a new one. Tying this into the existing `executeAudit` flow was surprisingly smooth.

## 2026-05-20 22:00 - Diff Engine Logic
Writing the logic to match up old recommendations with new ones. Had to handle edge cases like a tool being completely removed from the config, or a brand new tool being recommended that wasn't there before.

## 2026-05-21 00:15 - Diff UI Refinements
The user feedback highlighted that a unified row with crossed-out text wasn't literal enough for "side-by-side". Refactored `DiffView.tsx` into a strict two-column grid. Looks much better now and explicitly shows the exact spend and savings changes side by side.

## 2026-05-21 01:30 - Finishing touches
Fixed a bug where the Lead Capture "Notify Me" state wouldn't persist on page reload by dropping a quick flag in `localStorage`. Added an "Updated" pill to the audit history page. Everything looks solid. Done.
