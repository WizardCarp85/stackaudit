/**
 * Audit Engine — v3 (Config-driven)
 * ─────────────────────────────────────────────────────────────────────────────
 * Rules are loaded dynamically from TOOLS_MAP. No hardcoded logic per tool!
 *
 * Evaluation order per tool:
 *  1. Overlaps: Is a conflicting tool active? (highest priority saving)
 *  2. Use Case: Is the tool being used for the wrong job?
 *  3. Fixed Downgrades: Unconditional plan switches (e.g. Ultra -> Pro)
 *  4. API Optimisations: Threshold-based model switching
 *  5. Plan Right-Sizing: Downgrades based on team size
 *  6. Seat Overage: Are there more seats than team members?
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { AuditFormState, AuditResult, ToolEntry, ToolRecommendation } from "./types";
import { TOOLS_MAP, TOOLS_CONFIG } from "./tools-config";

// ─── Cross-tool comparison categories ─────────────────────────────────────────
// Tools in the same category serve similar purposes and can be compared.
const TOOL_CATEGORIES: Record<string, string[]> = {
  ai_assistant: ["claude", "chatgpt", "gemini"],
  ide_coding: ["cursor", "github_copilot", "windsurf"],
  api_llm: ["anthropic_api", "openai_api"],
};

function getToolCategory(toolId: string): string | null {
  for (const [category, ids] of Object.entries(TOOL_CATEGORIES)) {
    if (ids.includes(toolId)) return category;
  }
  return null;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Generic Evaluators ──────────────────────────────────────────────────────

function getPlanCost(toolId: string, planValue: string): number {
  const config = TOOLS_MAP[toolId as keyof typeof TOOLS_MAP];
  const plan = config?.plans.find((p) => p.value === planValue);
  return plan?.pricePerSeat ?? 0;
}

function evaluateTool(entry: ToolEntry, teamSize: number, otherActiveTools: string[]): Omit<ToolRecommendation, "toolId"> {
  const spend = parseFloat(entry.monthlySpend || "0") || 0;
  const seats = parseInt(entry.seats || "1", 10) || 1;
  const config = TOOLS_MAP[entry.toolId as keyof typeof TOOLS_MAP];
  const rules = config?.auditRules;

  // Hobby/Free is usually $0, short-circuit
  if (getPlanCost(entry.toolId, entry.plan) === 0 && spend === 0) {
    return {
      currentSpend: 0,
      recommendedAction: "No change — Free plan",
      potentialSaving: 0,
      reason: "You're on the free tier. No cost to optimise.",
    };
  }

  if (!rules) {
    return { currentSpend: spend, recommendedAction: "No change needed", potentialSaving: 0, reason: "No rules available." };
  }

  // 1. Overlaps
  if (rules.overlapWith) {
    for (const rule of rules.overlapWith) {
      if (otherActiveTools.includes(rule.toolId)) {
        return {
          currentSpend: spend,
          recommendedAction: `Drop ${config.name} — you already pay for ${TOOLS_MAP[rule.toolId as keyof typeof TOOLS_MAP]?.name || rule.toolId}`,
          potentialSaving: spend,
          reason: rule.message,
        };
      }
    }
  }

  // 2. Use Case
  if (rules.idealUseCases && entry.useCase) {
    if (!rules.idealUseCases.cases.includes(entry.useCase)) {
      return {
        currentSpend: spend,
        recommendedAction: `Switch to ${rules.idealUseCases.alternative} for ${entry.useCase}`,
        potentialSaving: Math.round(spend * 0.5),
        reason: rules.idealUseCases.message.replace("{useCase}", entry.useCase),
      };
    }
  }

  // 3. Fixed Downgrades
  if (rules.fixedDowngrades && rules.fixedDowngrades[entry.plan]) {
    const rule = rules.fixedDowngrades[entry.plan];
    const oldCostPerSeat = getPlanCost(entry.toolId, entry.plan);
    const newCostPerSeat = getPlanCost(entry.toolId, rule.fallbackPlan);
    const potentialSaving = (oldCostPerSeat - newCostPerSeat) * seats;
    
    // We add the tool name for tests to pass (e.g. "Downgrade to Cursor Pro")
    const altPlanLabel = config.plans.find(p => p.value === rule.fallbackPlan)?.label.split(" (")[0] || rule.fallbackPlan;
    
    return {
      currentSpend: spend,
      recommendedAction: `Downgrade to ${config.name} ${altPlanLabel}`,
      potentialSaving,
      reason: rule.message,
    };
  }

  // 4. API Optimisations
  if (rules.apiOptimizations && rules.apiOptimizations[entry.plan]) {
    const rule = rules.apiOptimizations[entry.plan];
    if (spend > rule.threshold) {
      const estimatedSaving = Math.round(spend * rule.savingMultiplier);
      const altPlanLabel = config.plans.find(p => p.value === rule.alternativePlan)?.label.split(" (")[0] || rule.alternativePlan;
      return {
        currentSpend: spend,
        recommendedAction: `Switch to ${altPlanLabel} to reduce API costs`,
        potentialSaving: estimatedSaving,
        reason: rule.message,
      };
    }
  }

  // 5. Plan Right-Sizing
  if (rules.minSeatsForPlan && rules.minSeatsForPlan[entry.plan]) {
    const rule = rules.minSeatsForPlan[entry.plan];
    if (seats < rule.minSeats) {
      const oldPrice = getPlanCost(entry.toolId, entry.plan);
      const newPrice = getPlanCost(entry.toolId, rule.fallbackPlan);
      const saving = seats * (oldPrice - newPrice);
      
      const altPlanLabel = config.plans.find(p => p.value === rule.fallbackPlan)?.label.split(" (")[0] || rule.fallbackPlan;
      
      return {
        currentSpend: spend,
        recommendedAction: `Downgrade to ${config.name} ${altPlanLabel}`,
        potentialSaving: saving,
        reason: rule.message.replace("{seats}", seats.toString()),
      };
    }
  }

  // 6. Seat Overage
  if (teamSize > 0 && seats > teamSize) {
    const pricePerSeat = getPlanCost(entry.toolId, entry.plan);
    const saving = (seats - teamSize) * pricePerSeat;
    if (saving > 0) {
      return {
        currentSpend: spend,
        recommendedAction: `Reduce to ${teamSize} seats — you have ${seats - teamSize} unused licences`,
        potentialSaving: saving,
        reason: `${seats - teamSize} unused ${config.name} seats at $${pricePerSeat}/seat = $${saving}/mo wasted.`,
      };
    }
  }

  // 7. Price Spike Detection — if the current plan is significantly more expensive
  //    than a cheaper alternative plan, suggest downgrading.
  {
    const currentPrice = getPlanCost(entry.toolId, entry.plan);
    if (currentPrice > 0) {
      // Find all cheaper plans (non-free, non-null pricePerSeat, cheaper than current)
      const cheaperPlans = config.plans
        .filter((p) => p.value !== entry.plan && p.pricePerSeat !== null && p.pricePerSeat > 0 && p.pricePerSeat < currentPrice)
        .sort((a, b) => (b.pricePerSeat ?? 0) - (a.pricePerSeat ?? 0)); // Most expensive first (closest downgrade)

      if (cheaperPlans.length > 0) {
        const bestAlt = cheaperPlans[0];
        const altPrice = bestAlt.pricePerSeat ?? 0;
        // Only trigger if the current plan is ≥1.5x the alternative (significant difference)
        if (currentPrice >= altPrice * 1.5) {
          const saving = (currentPrice - altPrice) * seats;
          const altLabel = bestAlt.label.split(" (")[0] || bestAlt.value;
          return {
            currentSpend: spend,
            recommendedAction: `Consider ${config.name} ${altLabel} — ${Math.round(((currentPrice - altPrice) / currentPrice) * 100)}% cheaper per seat`,
            potentialSaving: Math.round(saving),
            reason: `${config.name} ${altLabel} ($${altPrice}/seat) offers similar capabilities at a fraction of the cost. Your current plan is $${currentPrice}/seat — switching could save $${Math.round(saving)}/mo.`,
          };
        }
      }
    }
  }

  // 8. Cross-tool comparison — compare against the cheapest equivalent tool
  //    in the same category (e.g. Gemini Pro $199/seat vs Claude Pro $20/seat)
  {
    const currentPrice = getPlanCost(entry.toolId, entry.plan);
    const category = getToolCategory(entry.toolId);

    if (currentPrice > 0 && category) {
      const competitorIds = TOOL_CATEGORIES[category].filter((id) => id !== entry.toolId);
      let bestAlt: { toolName: string; planLabel: string; price: number } | null = null;

      for (const compId of competitorIds) {
        const compConfig = TOOLS_CONFIG.find((t) => t.id === compId);
        if (!compConfig) continue;
        for (const plan of compConfig.plans) {
          if (plan.pricePerSeat !== null && plan.pricePerSeat > 0 && plan.pricePerSeat < currentPrice) {
            if (!bestAlt || plan.pricePerSeat < bestAlt.price) {
              bestAlt = {
                toolName: compConfig.name,
                planLabel: plan.label.split(" (")[0] || plan.value,
                price: plan.pricePerSeat,
              };
            }
          }
        }
      }

      if (bestAlt && currentPrice >= bestAlt.price * 2) {
        const saving = (currentPrice - bestAlt.price) * seats;
        const pctCheaper = Math.round(((currentPrice - bestAlt.price) / currentPrice) * 100);
        return {
          currentSpend: spend,
          recommendedAction: `Switch to ${bestAlt.toolName} ${bestAlt.planLabel} — ${pctCheaper}% cheaper for similar capabilities`,
          potentialSaving: Math.round(saving),
          reason: `${bestAlt.toolName} ${bestAlt.planLabel} costs $${bestAlt.price}/seat vs your current $${currentPrice}/seat on ${config.name}. For the same type of work, switching saves $${Math.round(saving)}/mo.`,
        };
      }
    }
  }

  return {
    currentSpend: spend,
    recommendedAction: "No change needed — plan fits usage",
    potentialSaving: 0,
    reason: "Plan tier and seat count align with your team size and use case.",
  };
}

// ─── Main audit runner ────────────────────────────────────────────────────────

export function runAudit(form: AuditFormState, overrideId?: string): AuditResult {
  const recommendations: ToolRecommendation[] = [];
  let totalMonthlySpend = 0;
  let totalMonthlySaving = 0;

  const teamSize = parseInt(form.teamSize || "0", 10) || 0;
  const activeTools = form.tools.map((e) => e.toolId);

  for (let i = 0; i < form.tools.length; i++) {
    const entry = form.tools[i];
    const spend = parseFloat(entry.monthlySpend || "0") || 0;
    totalMonthlySpend += spend;

    const otherActiveTools = activeTools.filter((id, index) => index !== i);
    const result = evaluateTool(entry, teamSize, otherActiveTools);

    totalMonthlySaving += result.potentialSaving;

    recommendations.push({
      toolId: entry.toolId,
      ...result,
    });
  }

  const totalAnnualSaving = totalMonthlySaving * 12;

  const topSaving = [...recommendations].sort((a, b) => b.potentialSaving - a.potentialSaving)[0];
  const aiSummary =
    totalMonthlySaving >= 500
      ? `Your AI stack has real inefficiencies. We found $${totalMonthlySaving}/month ($${totalAnnualSaving}/year) in savings — primarily from ${topSaving?.recommendedAction?.toLowerCase() ?? "plan right-sizing"}. The biggest wins come from eliminating redundant tools and matching plan tier to actual team size. Credex can help you access discounted credits to capture even more of that saving on top of these optimisations.`
      : totalMonthlySaving > 0
      ? `Your AI stack is mostly well-optimised. We found $${totalMonthlySaving}/month in potential savings through plan adjustments. Keep an eye on seat utilisation as your team grows — that's typically where quiet overspend builds up.`
      : `You're spending well. No obvious savings found based on your current plans and team size. We'll notify you when new optimisations apply to your stack.`;

  return {
    id: overrideId ?? generateId(),
    formState: form,
    recommendations,
    totalMonthlySpend,
    totalMonthlySaving,
    totalAnnualSaving,
    aiSummary,
    auditedAt: new Date().toISOString(),
    pricingSnapshot: Object.values(TOOLS_MAP),
    pricingOutdated: false,
  };
}