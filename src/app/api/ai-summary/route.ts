/**
 * POST /api/ai-summary
 * ─────────────────────────────────────────────────────────────────────────────
 * Accepts an AuditResult JSON body and returns an AI-generated ~100-word
 * personalized summary paragraph via the Google Gemini API.
 *
 * Falls back to a templated summary on any failure (missing key, network
 * error, rate limit, timeout).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { generateAiSummary } from "@/lib/ai-summary";
import type { AuditResult } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuditResult;

    // Basic validation — make sure we have the fields we need
    if (
      typeof body.totalMonthlySpend !== "number" ||
      typeof body.totalMonthlySaving !== "number" ||
      !Array.isArray(body.recommendations)
    ) {
      return Response.json(
        { error: "Invalid audit result payload" },
        { status: 400 }
      );
    }

    const data = await generateAiSummary(body);
    return Response.json(data);
  } catch (err) {
    console.error("[api/ai-summary] Unexpected error:", err);
    return Response.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
