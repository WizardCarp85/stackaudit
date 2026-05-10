/**
 * AI Summary Generator
 * ─────────────────────────────────────────────────────────────────────────────
 * This module generates the ~100-word personalized audit summary paragraph
 * using the Anthropic API (claude-3-5-haiku preferred for speed + cost).
 *
 * Full prompt lives in PROMPTS.md.
 *
 * Implementation checklist:
 *   [ ] Install @anthropic-ai/sdk  (npm install @anthropic-ai/sdk)
 *   [ ] Set ANTHROPIC_API_KEY in .env.local
 *   [ ] Wire buildPrompt() with values from AuditResult
 *   [ ] Call generateAiSummary() from the /api/audit route handler
 *   [ ] Return aiSummary in the JSON response; AuditResultPage renders it
 *
 * Fallback behaviour:
 *   If the API call fails for any reason (network, quota, timeout) the function
 *   returns a deterministic templated summary so the page always renders.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { AuditResult } from "@/lib/types";

/** Build the prompt string to send to the model. See PROMPTS.md for full spec. */
function buildPrompt(result: AuditResult): string {
  // TODO: replace with real prompt from PROMPTS.md once finalised
  const toolNames = result.recommendations.map((r) => r.toolId).join(", ");
  return `You are a concise financial advisor for AI tools.
Given this audit data, write a ~100-word personalised summary paragraph.
Tools audited: ${toolNames}.
Total monthly spend: $${result.totalMonthlySpend}.
Potential monthly saving: $${result.totalMonthlySaving}.
Write in second-person, be honest, avoid hype.`;
}

/** Deterministic fallback when the AI call fails. */
function buildTemplateSummary(result: AuditResult): string {
  if (result.totalMonthlySaving > 500) {
    return (
      `Based on your current AI stack, you could save approximately ` +
      `$${result.totalMonthlySaving.toFixed(0)}/month ($${result.totalAnnualSaving.toFixed(0)}/year) ` +
      `by right-sizing plans and switching to more cost-effective alternatives. ` +
      `Your biggest opportunities are in consolidating overlapping tools and ` +
      `moving to usage-based plans where seat licences are underutilised. ` +
      `Credex can help you access discounted credits to capture even more of that saving.`
    );
  }
  return (
    `Your AI stack looks reasonably optimised. We found $${result.totalMonthlySaving.toFixed(0)}/month ` +
    `in potential savings — mostly through plan adjustments. ` +
    `Keep an eye on seat utilisation as your team grows; ` +
    `that's usually where overspend quietly creeps in.`
  );
}

/**
 * Generate a personalised audit summary.
 *
 * @param result - The fully computed AuditResult
 * @returns      - A ~100-word summary paragraph (AI or templated fallback)
 *
 * TODO: uncomment and flesh out once @anthropic-ai/sdk is installed.
 */
export async function generateAiSummary(result: AuditResult): Promise<string> {
  // ── Uncomment when ready ─────────────────────────────────────────────────
  //
  // import Anthropic from "@anthropic-ai/sdk";
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  //
  // try {
  //   const message = await client.messages.create({
  //     model: "claude-haiku-4-5",
  //     max_tokens: 256,
  //     messages: [{ role: "user", content: buildPrompt(result) }],
  //   });
  //   const text = message.content
  //     .filter((b) => b.type === "text")
  //     .map((b) => (b as { type: "text"; text: string }).text)
  //     .join("");
  //   return text.trim();
  // } catch (err) {
  //   console.error("[ai-summary] Anthropic API failed, using fallback:", err);
  //   return buildTemplateSummary(result);
  // }
  // ────────────────────────────────────────────────────────────────────────

  // Placeholder: always returns the templated summary until implemented
  void buildPrompt; // suppress unused-variable lint until wired up
  return buildTemplateSummary(result);
}
