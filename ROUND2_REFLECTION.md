### 1. What was the most uncomfortable trade-off you made because of the time pressure?

The hardest trade-off was deciding not to build a full database that tracks how prices change over time. Instead, I just saved a simple "snapshot" of the prices directly into each user's audit result. While this was much faster to build and works perfectly for comparing old vs. new prices, it means the system doesn't remember pricing history. Because of this, we can't answer questions like "How much did Cursor cost last year?" or let users run audits using past prices.

### 2. If we extended the deadline by another 24 hours right now, what's the first thing you'd do?

The absolute first thing I would do is add an admin dashboard and API endpoints to manage AI tool pricing in a database, rather than hardcoding them in a file. Currently, changing a tool's price requires manually editing the code and redeploying the entire application. If prices were managed via an endpoint, an admin could update them instantly. This would also make it much easier to detect when a price changes and automatically trigger notifications to affected users.

### 3. Looking back at your Round 1 codebase as a now-experienced user of it: what's one thing your Round 1 self made harder for your Round 2 self?

In Round 1, I had hardcoded prices directly inside the audit engine. This meant that whenever a price changed, I had to search through the entire engine and update each instance manually. To fix this, I decided to centralize the pricing configuration. Now, I only need to update the price in one single configuration file, and the audit engine automatically uses the updated prices everywhere they are needed.