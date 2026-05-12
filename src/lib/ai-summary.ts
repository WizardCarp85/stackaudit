/**
 * AI Summary Generator
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates a ~100-word personalized audit summary paragraph using the
 * Anthropic API (Claude Haiku 4.5 for speed + cost).
 *
 * Full prompt specification lives in PROMPTS.md.
 *
 * Fallback behaviour:
 *   If the API call fails for any reason (network, quota, timeout, missing key)
 *   the function returns a deterministic templated summary so the page always
 *   renders.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuditResult } from "@/lib/types";
import { TOOLS_MAP } from "@/lib/tools-config";

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a concise, honest financial advisor specialising in AI developer tools.
You are writing a personalized ~100-word summary paragraph for a company's AI spend audit report.

Rules:
- Write in second person ("you", "your").
- Be honest and direct. If the stack is already well-optimised, say so.
- Never manufacture savings or invent problems.
- Reference specific tools and dollar amounts from the audit data.
- If savings are >$500/mo, mention Credex as a way to capture discounted credits.
- If savings are <$100/mo, acknowledge they're spending well and suggest monitoring.
- Do NOT use bullet points — write a single flowing paragraph.
- Do NOT use marketing language, hype, or superlatives.
- Keep it under 120 words.`;

// ─── Build the user prompt from audit data ────────────────────────────────────

function buildUserPrompt(result: AuditResult): string {
  const companyLabel = result.formState.companyName || "this team";
  const teamSize = result.formState.teamSize || "unknown";

  const toolBreakdown = result.recommendations
    .map((rec) => {
      const toolName = TOOLS_MAP[rec.toolId]?.name ?? rec.toolId;
      return `- ${toolName}: Currently $${rec.currentSpend}/mo → ${rec.recommendedAction} (saves $${rec.potentialSaving}/mo). ${rec.reason}`;
    })
    .join("\n");

  return `Here is the audit data for ${companyLabel}:

Team size: ${teamSize} people
Total monthly spend: $${result.totalMonthlySpend}/month
Potential monthly saving: $${result.totalMonthlySaving}/month ($${result.totalAnnualSaving}/year)

Per-tool breakdown:
${toolBreakdown}

Write a ~100-word personalised summary paragraph for this audit report.`;
}

// ─── Deterministic fallback when the AI call fails ────────────────────────────

function buildTemplateSummary(result: AuditResult): string {
  const topSaving = [...result.recommendations].sort(
    (a, b) => b.potentialSaving - a.potentialSaving
  )[0];

  if (result.totalMonthlySaving >= 500) {
    return (
      `Based on your current AI stack, you could save approximately ` +
      `$${result.totalMonthlySaving.toFixed(0)}/month ($${result.totalAnnualSaving.toFixed(0)}/year) ` +
      `by right-sizing plans and switching to more cost-effective alternatives. ` +
      `Your biggest opportunity is ${topSaving?.recommendedAction?.toLowerCase() ?? "consolidating overlapping tools"}. ` +
      `Credex can help you access discounted credits to capture even more of that saving.`
    );
  }

  if (result.totalMonthlySaving > 0) {
    return (
      `Your AI stack looks reasonably optimised. We found $${result.totalMonthlySaving.toFixed(0)}/month ` +
      `in potential savings — mostly through plan adjustments. ` +
      `Keep an eye on seat utilisation as your team grows; ` +
      `that's usually where overspend quietly creeps in.`
    );
  }

  return (
    `You're spending well. No obvious savings found based on your current plans ` +
    `and team size. We'll notify you when new optimisations apply to your stack.`
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Generate a personalised audit summary.
 *
 * @param result - The fully computed AuditResult
 * @returns      - An object containing the summary text and its source ('ai' or 'template')
 */
export async function generateAiSummary(result: AuditResult): Promise<{ summary: string; source: "ai" | "template" }> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  // If no API key or placeholder key, skip the API call entirely
  if (!apiKey || apiKey.includes("REPLACE")) {
    console.warn("[ai-summary] No valid GOOGLE_GENERATIVE_AI_API_KEY set, using fallback template.");
    return { summary: buildTemplateSummary(result), source: "template" };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT 
    });

    console.log(`[ai-summary] Requesting Gemini summary for ${result.formState.companyName || "unknown"}...`);
    
    const result_ai = await model.generateContent(buildUserPrompt(result));
    const response = await result_ai.response;
    const text = response.text();

    if (text && text.trim()) {
      console.log("[ai-summary] Successfully generated AI summary.");
      return { summary: text.trim(), source: "ai" };
    }

    // Empty response — fall through to template
    console.warn("[ai-summary] Empty response from Gemini, using fallback template.");
    return { summary: buildTemplateSummary(result), source: "template" };
  } catch (err: any) {
    // Log more specific error details
    const status = err?.status || "unknown status";
    const message = err?.message || "unknown error";
    console.error(`[ai-summary] Gemini API failed (${status}): ${message}`);
    
    if (message.includes("API_KEY_INVALID")) {
      console.error("[ai-summary] Error: Your Google API key appears to be invalid.");
    }

    return { summary: buildTemplateSummary(result), source: "template" };
  }
}
