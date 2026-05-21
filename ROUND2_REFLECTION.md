### 1. What was the most uncomfortable trade-off you made because of the time pressure?

The most uncomfortable trade-off was abandoning a robust, historically-versioned pricing database in favor of simply dumping a JSONB `pricing_snapshot` into the `audits` table. While the snapshot approach is incredibly fast to implement and works perfectly for a 1:1 diff, it means the system has no concept of pricing history over time. We can't answer queries like "How has Cursor's price changed over the last year?" or allow users to retroactively run audits against prices from a specific date in the past. It tightly couples the pricing state to individual user audits rather than treating pricing as a first-class global entity.

### 2. If we extended the deadline by another 24 hours right now, what's the first thing you'd do?

The absolute first thing I would do is implement proper background queueing for the `/api/detect-changes` endpoint (e.g., using Inngest or Upstash QStash). Right now, the cron job fetches all audits into memory, recalculates them synchronously, and fires off `fetch` requests to Resend in a massive loop. This is a ticking time bomb. If the user base grows past a few hundred records, this endpoint will inevitably hit Vercel's serverless timeout limits, causing the email dispatch process to silently fail halfway through.

### 3. Looking back at your Round 1 codebase as a now-experienced user of it: what's one thing your Round 1 self made harder for your Round 2 self?

My Round 1 self heavily overloaded the `runAudit` function to be a pure, synchronous function that strictly expects `TOOLS_CONFIG` to be exactly what is currently imported from the static file. This made it very difficult in Round 2 to "simulate" a re-run using *old* prices for the Diff View without completely mangling the engine. If Round 1 me had designed the engine to explicitly accept a `PricingContext` object as an argument instead of hardcoding the import, implementing the time-traveling Diff View logic would have been drastically cleaner and required far fewer localized state hacks.
