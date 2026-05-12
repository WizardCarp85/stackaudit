# StackAudit Metrics

### North Star Metric
**Total Identified Savings per Month**

**Why:** StackAudit is fundamentally a B2B lead-generation tool for the Credex marketplace. A metric like Daily Active Users (DAU) is useless here because a CFO or Founder will realistically only run a spend audit once a quarter. The true measure of our success is the total dollar amount of waste we expose. If "Total Identified Savings" is consistently high, it proves we are successfully diagnosing the problem, creating massive value for the user, and generating highly qualified leads with real buying intent for the Credex secondary marketplace.

---

### 3 Input Metrics
These three inputs directly drive the North Star metric up:

1. **Audit Completion Rate:** The percentage of users who start the form and actually reach the final results page. If this is low, the form is too long or confusing, and we identify zero savings.
2. **Average Team Size Audited:** Larger teams naturally have more seat bloat, overlap, and higher potential savings. Marketing campaigns should actively target startups with 20+ employees rather than solo founders.
3. **Tools Selected per Audit:** The number of tools a user inputs. If users only select one tool, the savings will be minimal. We need to encourage them to input their entire software stack to maximize the identified savings.

---

### What I'd Instrument First
I would immediately instrument the **Audit Completion Rate Funnel**. 

I need to know exactly where users are dropping off. Do they bounce immediately at the landing page? Do they stop when asked for their company name and team size? Do they give up while entering specific seat counts? Without this telemetry, I can't optimize the UX to guide them to the "aha!" moment (the results page where the savings are revealed).

---

### Pivot Decision Trigger
**Zero Lead Conversions after $100k in Identified Savings.**

If the tool successfully identifies $100,000 in collective savings for users, but *nobody* clicks the CTA to buy discounted credits on Credex or leaves their email for follow-up, it means the diagnostic tool works, but the bridge to the core business is completely broken. 

This specific threshold would trigger a pivot. It would tell us that either the UI isn't pushing the marketplace hard enough, the savings don't feel "real" to the user, or users simply don't trust a third-party marketplace to buy their software seats. At that point, the product strategy must change.
