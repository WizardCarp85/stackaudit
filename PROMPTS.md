# PROMPTS.md AI Summary Prompt Specification

> This file contains the full prompt used by the AI-generated personalized
> summary feature. The prompt is sent to **Claude Haiku 4.5** via the
> Anthropic Messages API. Implementation lives in `src/lib/ai-summary.ts`.

---

## 1. The full LLM prompts used in the tool

### System Prompt

```text
You are a concise, honest financial advisor specialising in AI developer tools.
You are writing a personalized ~100-word summary paragraph for a company's AI
spend audit report.

Rules:
- Write in second person ("you", "your").
- Be honest and direct. If the stack is already well-optimised, say so.
- Never manufacture savings or invent problems.
- Reference specific tools and dollar amounts from the audit data.
- If savings are >$500/mo, mention Credex as a way to capture discounted credits.
- If savings are <$100/mo, acknowledge they're spending well and suggest monitoring.
- Do NOT use bullet points write a single flowing paragraph.
- Do NOT use marketing language, hype, or superlatives.
- Keep it under 120 words.
```

### User Prompt Template

```text
Here is the audit data for {companyName || "this team"}:

Team size: {teamSize} people
Total monthly spend: ${totalMonthlySpend}/month
Potential monthly saving: ${totalMonthlySaving}/month (${totalAnnualSaving}/year)

Per-tool breakdown:
{for each recommendation}
- {toolName}: Currently ${currentSpend}/mo {recommendedAction} (saves ${potentialSaving}/mo). {reason}
{end for}

Write a ~100-word personalised summary paragraph for this audit report.
```

---

## 2. Why I wrote them this way

I structured the prompt with a strict System Persona ("concise, honest financial advisor") and a list of hard negative constraints (e.g., "Do NOT use bullet points," "Never manufacture savings"). 

By passing the audit math directly in the User Prompt Template as structured data rather than raw text, I significantly reduced the cognitive load on the LLM. The model only has to synthesize the text and adjust the tone based on the total savings, rather than performing any calculations itself. This guarantees the summary perfectly matches the deterministic math displayed elsewhere on the page, maintaining complete accuracy and user trust. The temperature is also set slightly lower than default (0.4) to keep the output focused and consistent.

---

## 3. What I tried that didn't work

**1. End-to-end LLM processing:**
Initially, I tried passing the raw user input (team size, tools used) directly to the LLM and asked it to figure out the savings *and* write the report in one shot. This failed completely. The LLM frequently hallucinated pricing tiers, miscalculated annual savings (often missing a zero), and suggested cutting tools the user hadn't even selected. The fix was separating the deterministic math (hardcoded in TypeScript) from the qualitative synthesis (the LLM prompt).

**2. Open-ended formatting:**
I originally asked for a "detailed report." The LLM would output 500-word essays filled with marketing fluff and excessive bullet points that broke the UI layout of the results page. Adding strict length constraints ("Keep it under 120 words") and format constraints ("Do NOT use bullet points write a single flowing paragraph") was necessary to make the output fit neatly into the `AiSummaryCard` component.
