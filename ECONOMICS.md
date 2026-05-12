# Unit Economics & Mathematical Breakdown

### Value of a Converted Lead to Credex
A converted lead for Credex is a startup that successfully purchases discounted AI credits (or secures financing) through the Credex marketplace after using StackAudit.
* **Assumption 1:** The average Series A startup buys $40,000 worth of AI credits for their team.
* **Assumption 2:** Credex takes a 12.5% marketplace fee (take-rate) on these transactions.
* **Gross Profit per Transaction:** $40,000 * 12.5% = **$5,000**.
* **Assumption 3:** 20% of startups return to buy more credits the following year.
* **Lifetime Value (LTV):** $5,000 + ($5,000 * 0.20) = **$6,000**.

Therefore, a single converted lead who completes a transaction is worth roughly **$6,000** to Credex.

### CAC at Each Channel (From GTM Plan)
Since our paid budget is $0, Customer Acquisition Cost (CAC) is calculated purely based on labor hours (assuming founder/sales time is worth $50/hour).

**Channel 1: Direct Cold Outbound (Crunchbase/LinkedIn)**
* Time to source and email 100 VPs of Finance: 3 hours ($150 labor).
* Conversion to completed audit: 2% (2 audits).
* Conversion from audit to booked call: 5% (0.1 calls).
* To get 1 booked call, we need 1,000 emails = 30 hours ($1,500).
* Close rate on calls to purchase: 20%.
* To get 1 customer, we need 5 calls = 150 hours.
* **CAC for Outbound:** 150 hours * $50 = **$7,500**.
*(Note: At an LTV of $6k, pure manual outbound is actually unprofitable on a labor basis and will need to be automated quickly).*

**Channel 2: "Off the Ledger" Slack Community**
* Time to write engaging posts and reply to threads: 4 hours ($200 labor).
* Generates 40 completed audits.
* 5% convert to a booked call = 2 calls.
* 20% close rate on calls = 0.4 customers.
* To get 1 customer, we need 10 hours of engagement.
* **CAC for Slack Communities:** 10 hours * $50 = **$500**.
*(Highly profitable, but difficult to scale indefinitely).*

### The Target Conversion Funnel
To build a sustainable, profitable engine (blended CAC < $2,000), our funnel from StackAudit must look like this:
* **Audit Completed to Email Captured:** 20%
* **Email Captured to "Credex Consultation Booked":** 25% (Effectively 5% of all completed audits).
* **Consultation Booked to Credit Purchase:** 20%.
* **Funnel Summary:** For every 100 completed audits, we get 5 booked calls and **1 paying customer**.

### The Path to $1M ARR in 18 Months
What has to be true for StackAudit to drive $1,000,000 in ARR for Credex?

1. **Target Customers Needed:** $1,000,000 / $5,000 (First-year revenue) = **200 Customers**.
2. **Working backwards through the funnel:**
   * 200 customers requires **1,000 booked consultations** (20% close rate).
   * 1,000 consultations requires **20,000 completed audits** (5% booking rate).
   * 20,000 completed audits requires **133,333 site visitors** (assuming a 15% landing-page-to-audit-completion rate).

**What must be true to hit 133k visitors in 18 months (~7,400 visitors/month):**
Manual Slack posting and LinkedIn scraping will never reach 7,400 visitors a month. To achieve this scale, StackAudit must successfully transition to programmatic SEO. We would need to programmatically generate hundreds of comparison pages (e.g., `stackaudit.com/compare/github-copilot-vs-cursor-pricing`, `stackaudit.com/calculator/claude-team-roi`) that capture the exact high-intent search queries outlined in the GTM plan. If those pages can rank on Google within 6 months, hitting 7.4k monthly visits is highly realistic.
