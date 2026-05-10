/**
 * Audit Engine — placeholder implementation
 * ─────────────────────────────────────────────────────────────────────────────
 * TODO (Feature #2): Replace with real defensible audit logic.
 * Every rule must cite a source URL from PRICING_DATA.md.
 *
 * Current logic: flags overkill seats and applies a 20% saving estimate.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { AuditFormState, AuditResult, ToolRecommendation } from "./types";
import { TOOLS_MAP } from "./tools-config";

function generateId(): string {
  // crypto.randomUUID() is available in all modern browsers and Node 19+
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function runAudit(form: AuditFormState): AuditResult {
  const recommendations: ToolRecommendation[] = [];
  let totalMonthlySpend = 0;
  let totalMonthlySaving = 0;

  for (const entry of Object.values(form.tools)) {
    if (!entry.enabled) continue;

    const spend = parseFloat(entry.monthlySpend || "0");
    const seats = parseInt(entry.seats || "1", 10);
    const config = TOOLS_MAP[entry.toolId];
    const teamSize = parseInt(form.teamSize || "0", 10);

    totalMonthlySpend += isNaN(spend) ? 0 : spend;

    // Rule: flag if seats significantly exceed team size
    const isOverkill = teamSize > 0 && seats > teamSize;
    const saving = isOverkill ? Math.round(spend * 0.2) : 0;
    totalMonthlySaving += saving;

    recommendations.push({
      toolId: entry.toolId,
      currentSpend: isNaN(spend) ? 0 : spend,
      recommendedAction: isOverkill
        ? `Reduce from ${seats} to ${teamSize} seats on ${config?.name}`
        : "No change needed — plan fits usage",
      potentialSaving: saving,
      reason: isOverkill
        ? `You have ${seats} seats but only ${teamSize} people on the team. Right-sizing saves ~20%.`
        : "Your seat count aligns with your team size and the plan tier looks appropriate.",
    });
  }

  const totalAnnualSaving = totalMonthlySaving * 12;

  const aiSummary =
    totalMonthlySaving >= 500
      ? `Based on your current AI stack, you could save approximately $${totalMonthlySaving}/month ($${totalAnnualSaving}/year) by right-sizing plans and switching to more cost-effective alternatives. Your biggest opportunities are in consolidating overlapping tools and moving to usage-based plans where seat licences are underutilised. Credex can help you access discounted credits to capture even more of that saving.`
      : `Your AI stack looks reasonably optimised. We found $${totalMonthlySaving}/month in potential savings — mostly through plan adjustments. Keep an eye on seat utilisation as your team grows; that's usually where overspend quietly creeps in.`;

  return {
    id: generateId(),
    formState: form,
    recommendations,
    totalMonthlySpend,
    totalMonthlySaving,
    totalAnnualSaving,
    aiSummary,
    auditedAt: new Date().toISOString(),
  };
}
