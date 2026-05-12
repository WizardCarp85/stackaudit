/**
 * Audit Engine — v2
 * ─────────────────────────────────────────────────────────────────────────────
 * Rules are hardcoded and defensible. Every pricing number traces to
 * PRICING_DATA.md. No AI is used for the math — that's intentional.
 *
 * Logic per tool:
 *  1. Is the user on the right plan for their team size?
 *  2. Is there a cheaper plan from the same vendor that fits?
 *  3. Is there a cheaper alternative tool for the same use case?
 *  4. Are they paying retail when credits would be cheaper?
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { AuditFormState, AuditResult, ToolEntry, ToolRecommendation } from "./types";
import { TOOLS_MAP } from "./tools-config";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Per-tool audit functions ─────────────────────────────────────────────────

function auditCursor(entry: ToolEntry, teamSize: number): Omit<ToolRecommendation, "toolId"> {
  const spend = parseFloat(entry.monthlySpend || "0") || 0;
  const seats = parseInt(entry.seats || "1", 10) || 1;
  const plan = entry.plan;
  const useCase = entry.useCase;

  // Hobby is free — check if they're reporting spend anyway
  if (plan === "hobby") {
    return {
      currentSpend: spend,
      recommendedAction: "No change — Hobby plan is free",
      potentialSaving: 0,
      reason: "You're on the free tier. No savings available here.",
    };
  }

  // Business ($40/seat) for small teams → Pro ($20/seat) is enough
  // Business adds admin controls, useful only for 5+ devs
  // Source: https://cursor.com/pricing
  if (plan === "business" && seats < 5) {
    const saving = seats * (40 - 20);
    return {
      currentSpend: spend,
      recommendedAction: `Downgrade to Cursor Pro ($20/seat) — Business features unused at ${seats} seats`,
      potentialSaving: saving,
      reason: `Business plan ($40/seat) adds SSO and centralised billing — overkill for <5 devs. Pro ($20/seat) covers all coding features. Saves $${saving}/mo. Source: cursor.com/pricing`,
    };
  }

  // Non-coding use case on a coding tool
  if (useCase && useCase !== "coding" && useCase !== "mixed") {
    const saving = Math.round(spend * 0.5);
    return {
      currentSpend: spend,
      recommendedAction: "Consider switching to Claude Pro or ChatGPT Plus for non-coding tasks",
      potentialSaving: saving,
      reason: `Cursor is optimised for code editing in an IDE. For ${useCase} workflows, Claude Pro ($20/mo) or ChatGPT Plus ($20/mo) provides better value. Saves ~$${saving}/mo.`,
    };
  }

  // Seats exceed team size — right-size
  if (teamSize > 0 && seats > teamSize) {
    const pricePerSeat = plan === "business" ? 40 : 20;
    const saving = (seats - teamSize) * pricePerSeat;
    return {
      currentSpend: spend,
      recommendedAction: `Reduce to ${teamSize} seats — you have ${seats - teamSize} unused licences`,
      potentialSaving: saving,
      reason: `${seats - teamSize} unused Cursor seats at $${pricePerSeat}/seat = $${saving}/mo wasted. Source: cursor.com/pricing`,
    };
  }

  return {
    currentSpend: spend,
    recommendedAction: "No change needed — plan fits usage",
    potentialSaving: 0,
    reason: "Seat count and plan tier align with your team size and use case.",
  };
}

function auditGithubCopilot(entry: ToolEntry, teamSize: number, otherTools: string[]): Omit<ToolRecommendation, "toolId"> {
  const spend = parseFloat(entry.monthlySpend || "0") || 0;
  const seats = parseInt(entry.seats || "1", 10) || 1;
  const plan = entry.plan;
  const useCase = entry.useCase;

  // If they also have Cursor — overlap, suggest dropping Copilot
  // Cursor Pro is $20/seat vs Copilot Business $19/seat — similar price, Cursor has better UX
  if (otherTools.includes("cursor")) {
    return {
      currentSpend: spend,
      recommendedAction: "Drop GitHub Copilot — you already pay for Cursor which overlaps fully",
      potentialSaving: spend,
      reason: `Cursor and GitHub Copilot both provide AI code completion in the IDE. Running both is redundant. Cursor Pro ($20/seat) has broader model access. Eliminating Copilot saves $${spend}/mo. Source: github.com/features/copilot/plans`,
    };
  }

  // Enterprise ($39/seat) for small teams — Business ($19/seat) is enough
  // Enterprise adds audit logs + policy controls, useful only for 10+ seat orgs
  if (plan === "enterprise" && seats < 10) {
    const saving = seats * (39 - 19);
    return {
      currentSpend: spend,
      recommendedAction: `Downgrade to Copilot Business ($19/seat) — Enterprise features unused at ${seats} seats`,
      potentialSaving: saving,
      reason: `Copilot Enterprise ($39/seat) adds audit logs and org-wide policies — valuable only for 10+ seat compliance needs. Business ($19/seat) covers all AI coding features. Saves $${saving}/mo. Source: github.com/features/copilot/plans`,
    };
  }

  // Non-coding use case
  if (useCase && useCase !== "coding" && useCase !== "mixed") {
    return {
      currentSpend: spend,
      recommendedAction: "Switch to Claude Pro or ChatGPT Plus — Copilot is IDE-only",
      potentialSaving: Math.round(spend * 0.5),
      reason: `GitHub Copilot only works inside code editors. For ${useCase} tasks, Claude Pro ($20/mo) or ChatGPT Plus ($20/mo) is far more useful. Source: github.com/features/copilot/plans`,
    };
  }

  // Right-size seats
  if (teamSize > 0 && seats > teamSize) {
    const pricePerSeat = plan === "enterprise" ? 39 : plan === "business" ? 19 : 10;
    const saving = (seats - teamSize) * pricePerSeat;
    return {
      currentSpend: spend,
      recommendedAction: `Reduce to ${teamSize} seats — ${seats - teamSize} unused`,
      potentialSaving: saving,
      reason: `${seats - teamSize} unused Copilot seats at $${pricePerSeat}/seat = $${saving}/mo. Source: github.com/features/copilot/plans`,
    };
  }

  return {
    currentSpend: spend,
    recommendedAction: "No change needed — plan fits usage",
    potentialSaving: 0,
    reason: "Plan tier and seat count align with your team size.",
  };
}

function auditClaude(entry: ToolEntry, teamSize: number): Omit<ToolRecommendation, "toolId"> {
  const spend = parseFloat(entry.monthlySpend || "0") || 0;
  const seats = parseInt(entry.seats || "1", 10) || 1;
  const plan = entry.plan;

  if (plan === "free") {
    return {
      currentSpend: 0,
      recommendedAction: "No change — Free plan",
      potentialSaving: 0,
      reason: "You're on the free tier. No cost to optimise.",
    };
  }

  // Team Standard ($25/seat) for 1-2 people → Pro ($20/mo flat) is cheaper
  // Pro is per-account not per-seat, so for solo/duo it wins
  // Source: https://claude.com/pricing
  if ((plan === "team_standard" || plan === "team_premium") && seats <= 2) {
    const teamCost = seats * (plan === "team_standard" ? 25 : 125);
    const proCost = seats * 20; // each person gets their own Pro
    const saving = teamCost - proCost;
    if (saving > 0) {
      return {
        currentSpend: spend,
        recommendedAction: `Switch each user to Claude Pro ($20/mo each) — Team plan is overkill for ${seats} users`,
        potentialSaving: saving,
        reason: `Claude Team (${plan === "team_standard" ? "$25" : "$125"}/seat) requires min 5 seats and adds admin controls. For ${seats} users, individual Pro plans at $20/seat saves $${saving}/mo. Source: claude.com/pricing`,
      };
    }
  }

  // Team Premium ($125/seat) — check if Standard ($25/seat) suffices
  // Premium adds higher usage limits — only worth it if hitting limits regularly
  if (plan === "team_premium") {
    const saving = seats * (125 - 25);
    return {
      currentSpend: spend,
      recommendedAction: "Downgrade to Team Standard ($25/seat) unless hitting usage limits weekly",
      potentialSaving: saving,
      reason: `Team Premium ($125/seat) is for heavy power users hitting rate limits. Team Standard ($25/seat) covers most teams. If not hitting limits, saves $${saving}/mo. Source: claude.com/pricing`,
    };
  }

  // Seat overage
  if (teamSize > 0 && seats > teamSize) {
    const pricePerSeat = plan === "team_standard" ? 25 : plan === "team_premium" ? 125 : 20;
    const saving = (seats - teamSize) * pricePerSeat;
    return {
      currentSpend: spend,
      recommendedAction: `Remove ${seats - teamSize} unused seats`,
      potentialSaving: saving,
      reason: `${seats - teamSize} unused Claude seats at $${pricePerSeat}/seat = $${saving}/mo wasted. Source: claude.com/pricing`,
    };
  }

  return {
    currentSpend: spend,
    recommendedAction: "No change needed — plan fits usage",
    potentialSaving: 0,
    reason: "Plan tier and seat count look appropriate for your team.",
  };
}

function auditChatGPT(entry: ToolEntry, teamSize: number, otherTools: string[]): Omit<ToolRecommendation, "toolId"> {
  const spend = parseFloat(entry.monthlySpend || "0") || 0;
  const seats = parseInt(entry.seats || "1", 10) || 1;
  const plan = entry.plan;
  const useCase = entry.useCase;

  // Overlap with Claude — both are general-purpose LLM chat tools
  if (otherTools.includes("claude") && (plan === "plus" || plan === "team")) {
    const saving = spend;
    return {
      currentSpend: spend,
      recommendedAction: "Drop ChatGPT — you already pay for Claude which covers the same use cases",
      potentialSaving: saving,
      reason: `Claude and ChatGPT are near-equivalent for ${useCase || "general"} tasks. Running both is redundant. Consolidate to one. Saves $${saving}/mo. Source: chatgpt.com/pricing`,
    };
  }

  // Team ($30/seat) for 1-2 people → Plus ($20/seat) each
  if (plan === "team" && seats <= 2) {
    const saving = seats * (30 - 20);
    return {
      currentSpend: spend,
      recommendedAction: `Switch to ChatGPT Plus ($20/seat) — Team plan overhead not worth it for ${seats} users`,
      potentialSaving: saving,
      reason: `ChatGPT Team ($30/seat) adds shared workspace and admin tools. For ${seats} users, individual Plus plans save $${saving}/mo with no real loss of features. Source: chatgpt.com/pricing`,
    };
  }

  // Seat overage
  if (teamSize > 0 && seats > teamSize) {
    const pricePerSeat = plan === "team" ? 30 : 20;
    const saving = (seats - teamSize) * pricePerSeat;
    return {
      currentSpend: spend,
      recommendedAction: `Remove ${seats - teamSize} unused seats`,
      potentialSaving: saving,
      reason: `${seats - teamSize} unused ChatGPT seats at $${pricePerSeat}/seat = $${saving}/mo. Source: chatgpt.com/pricing`,
    };
  }

  return {
    currentSpend: spend,
    recommendedAction: "No change needed",
    potentialSaving: 0,
    reason: "Plan and seat count look appropriate.",
  };
}

function auditAnthropicApi(entry: ToolEntry): Omit<ToolRecommendation, "toolId"> {
  const spend = parseFloat(entry.monthlySpend || "0") || 0;
  const plan = entry.plan;

  // If spending heavily on Opus when Sonnet would do
  // Opus 4.7: $5/$25 per 1M tokens vs Sonnet 4.6: $3/$15 per 1M tokens
  // Source: https://claude.com/pricing#api
  if (plan === "opus_4_7" && spend > 100) {
    const estimatedSaving = Math.round(spend * 0.4); // Sonnet ~40% cheaper
    return {
      currentSpend: spend,
      recommendedAction: "Switch most calls to Claude Sonnet 4.6 — reserve Opus for complex tasks only",
      potentialSaving: estimatedSaving,
      reason: `Sonnet 4.6 ($3 input/$15 output per 1M tokens) is ~40% cheaper than Opus 4.7 ($5/$25) with near-equivalent quality for most tasks. Route complex reasoning to Opus, rest to Sonnet. Est. saves $${estimatedSaving}/mo. Source: claude.com/pricing`,
    };
  }

  // Heavy Sonnet spend → suggest Haiku for simple tasks
  if (plan === "sonnet_4_6" && spend > 200) {
    const estimatedSaving = Math.round(spend * 0.3);
    return {
      currentSpend: spend,
      recommendedAction: "Route simple/high-volume calls to Haiku 4.5 to reduce cost",
      potentialSaving: estimatedSaving,
      reason: `Haiku 4.5 ($1 input/$5 output per 1M tokens) is ~67% cheaper than Sonnet 4.6. For classification, summarisation, or structured extraction, Haiku performs comparably. Est. saves $${estimatedSaving}/mo. Source: claude.com/pricing`,
    };
  }

  return {
    currentSpend: spend,
    recommendedAction: "No change needed — model choice looks appropriate",
    potentialSaving: 0,
    reason: "API model selection appears cost-appropriate for the usage tier.",
  };
}

function auditOpenAiApi(entry: ToolEntry): Omit<ToolRecommendation, "toolId"> {
  const spend = parseFloat(entry.monthlySpend || "0") || 0;
  const plan = entry.plan;

  // Heavy GPT-5.5 spend → switch to GPT-5.4 or mini
  // GPT-5.5: $5/$30 vs GPT-5.4: $2.50/$15 per 1M tokens
  // Source: https://openai.com/api/pricing
  if (plan === "gpt_5_5" && spend > 100) {
    const estimatedSaving = Math.round(spend * 0.5);
    return {
      currentSpend: spend,
      recommendedAction: "Switch to GPT-5.4 for most tasks — GPT-5.5 only for hardest reasoning",
      potentialSaving: estimatedSaving,
      reason: `GPT-5.4 ($2.50 input/$15 output per 1M tokens) is 50% cheaper than GPT-5.5 ($5/$30). Reserve 5.5 for complex chain-of-thought tasks. Est. saves $${estimatedSaving}/mo. Source: openai.com/api/pricing`,
    };
  }

  // GPT-5.4 heavy spend → mini for simple tasks
  if (plan === "gpt_5_4" && spend > 150) {
    const estimatedSaving = Math.round(spend * 0.35);
    return {
      currentSpend: spend,
      recommendedAction: "Route simple tasks to GPT-5.4 mini to reduce cost",
      potentialSaving: estimatedSaving,
      reason: `GPT-5.4 mini ($0.75 input/$4.50 output per 1M tokens) is ~70% cheaper than GPT-5.4. Good for classification, extraction, and short-form generation. Est. saves $${estimatedSaving}/mo. Source: openai.com/api/pricing`,
    };
  }

  return {
    currentSpend: spend,
    recommendedAction: "No change needed — model choice looks appropriate",
    potentialSaving: 0,
    reason: "API model selection appears cost-appropriate for the usage tier.",
  };
}

function auditGemini(entry: ToolEntry, teamSize: number): Omit<ToolRecommendation, "toolId"> {
  const spend = parseFloat(entry.monthlySpend || "0") || 0;
  const seats = parseInt(entry.seats || "1", 10) || 1;
  const plan = entry.plan;
  const useCase = entry.useCase;

  // Ultra ($249.99/mo) — very high bar, likely overkill for most
  // Source: https://gemini.google/us/subscriptions/
  if (plan === "ultra") {
    return {
      currentSpend: spend,
      recommendedAction: "Downgrade to Gemini Pro ($19.99/mo) unless you specifically need Gemini Ultra's multimodal depth",
      potentialSaving: Math.round((249.99 - 19.99) * seats),
      reason: `Gemini Ultra ($249.99/mo) is designed for extreme multimodal and research tasks. Gemini Pro ($19.99/mo) handles coding, writing, and data tasks for most teams. Saves ~$${Math.round((249.99 - 19.99) * seats)}/mo. Source: gemini.google/us/subscriptions`,
    };
  }

  // API: heavy Gemini Pro spend → Flash is much cheaper for most tasks
  if (plan === "api_pro" && spend > 100) {
    const estimatedSaving = Math.round(spend * 0.5);
    return {
      currentSpend: spend,
      recommendedAction: "Route high-volume calls to Gemini Flash — 8x cheaper for most tasks",
      potentialSaving: estimatedSaving,
      reason: `Gemini Flash ($0.25/$1.50 per 1M tokens) is ~88% cheaper than Gemini Pro ($2/$12). For non-reasoning tasks (summarisation, classification, structured output), Flash performs comparably. Est. saves $${estimatedSaving}/mo. Source: ai.google.dev/gemini-api/docs/pricing`,
    };
  }

  // Non-data/research use case on Gemini → Claude or ChatGPT more cost-effective
  if (useCase === "coding" && (plan === "pro" || plan === "ultra")) {
    return {
      currentSpend: spend,
      recommendedAction: "Switch to Cursor Pro or GitHub Copilot for coding — Gemini has no IDE integration",
      potentialSaving: Math.round(spend * 0.3),
      reason: `Gemini has no native IDE plugin for code completion. Cursor Pro ($20/seat) or GitHub Copilot ($10-19/seat) integrates directly into your editor, making them more effective for coding workflows.`,
    };
  }

  return {
    currentSpend: spend,
    recommendedAction: "No change needed — plan fits usage",
    potentialSaving: 0,
    reason: "Plan appears appropriate for your use case and team size.",
  };
}

function auditWindsurf(entry: ToolEntry, teamSize: number, otherTools: string[]): Omit<ToolRecommendation, "toolId"> {
  const spend = parseFloat(entry.monthlySpend || "0") || 0;
  const seats = parseInt(entry.seats || "1", 10) || 1;
  const plan = entry.plan;

  if (plan === "free") {
    return {
      currentSpend: 0,
      recommendedAction: "No change — Free plan",
      potentialSaving: 0,
      reason: "You're on the free tier.",
    };
  }

  // Overlap with Cursor — both are AI code editors
  if (otherTools.includes("cursor")) {
    return {
      currentSpend: spend,
      recommendedAction: "Drop Windsurf — you already pay for Cursor which is a direct substitute",
      potentialSaving: spend,
      reason: `Cursor and Windsurf are both AI-first code editors with near-identical features. Running both wastes $${spend}/mo. Pick one — Cursor has broader model access. Source: windsurf.com/pricing`,
    };
  }

  // Teams ($40/seat) for <5 people → Pro ($20/seat)
  // Source: https://windsurf.com/pricing
  if (plan === "teams" && seats < 5) {
    const saving = seats * (40 - 20);
    return {
      currentSpend: spend,
      recommendedAction: `Downgrade to Windsurf Pro ($20/seat) — Teams plan overkill for ${seats} users`,
      potentialSaving: saving,
      reason: `Windsurf Teams ($40/seat) adds admin controls and centralised billing. For <5 devs, Pro ($20/seat) covers everything. Saves $${saving}/mo. Source: windsurf.com/pricing`,
    };
  }

  // Seat overage
  if (teamSize > 0 && seats > teamSize) {
    const pricePerSeat = plan === "teams" ? 40 : 20;
    const saving = (seats - teamSize) * pricePerSeat;
    return {
      currentSpend: spend,
      recommendedAction: `Remove ${seats - teamSize} unused seats`,
      potentialSaving: saving,
      reason: `${seats - teamSize} unused Windsurf seats at $${pricePerSeat}/seat = $${saving}/mo. Source: windsurf.com/pricing`,
    };
  }

  return {
    currentSpend: spend,
    recommendedAction: "No change needed — plan fits usage",
    potentialSaving: 0,
    reason: "Plan and seat count align with your team size.",
  };
}

// ─── Main audit runner ────────────────────────────────────────────────────────

export function runAudit(form: AuditFormState): AuditResult {
  const recommendations: ToolRecommendation[] = [];
  let totalMonthlySpend = 0;
  let totalMonthlySaving = 0;

  const teamSize = parseInt(form.teamSize || "0", 10) || 0;

  // Collect active tool IDs for overlap detection
  const activeTools = Object.values(form.tools)
    .filter((e) => e.enabled)
    .map((e) => e.toolId);

  for (const entry of Object.values(form.tools)) {
    if (!entry.enabled) continue;

    const spend = parseFloat(entry.monthlySpend || "0") || 0;
    totalMonthlySpend += spend;

    const otherActiveTools = activeTools.filter((id) => id !== entry.toolId);

    let result: Omit<ToolRecommendation, "toolId">;

    switch (entry.toolId) {
      case "cursor":
        result = auditCursor(entry, teamSize);
        break;
      case "github_copilot":
        result = auditGithubCopilot(entry, teamSize, otherActiveTools);
        break;
      case "claude":
        result = auditClaude(entry, teamSize);
        break;
      case "chatgpt":
        result = auditChatGPT(entry, teamSize, otherActiveTools);
        break;
      case "anthropic_api":
        result = auditAnthropicApi(entry);
        break;
      case "openai_api":
        result = auditOpenAiApi(entry);
        break;
      case "gemini":
        result = auditGemini(entry, teamSize);
        break;
      case "windsurf":
        result = auditWindsurf(entry, teamSize, otherActiveTools);
        break;
      default:
        result = {
          currentSpend: spend,
          recommendedAction: "No change needed",
          potentialSaving: 0,
          reason: "No audit rules available for this tool.",
        };
    }

    totalMonthlySaving += result.potentialSaving;

    recommendations.push({
      toolId: entry.toolId,
      ...result,
    });
  }

  const totalAnnualSaving = totalMonthlySaving * 12;

  // AI summary is generated separately via ai-summary.ts
  // This is the templated fallback
  const topSaving = [...recommendations].sort((a, b) => b.potentialSaving - a.potentialSaving)[0];
  const aiSummary =
    totalMonthlySaving >= 500
      ? `Your AI stack has real inefficiencies. We found $${totalMonthlySaving}/month ($${totalAnnualSaving}/year) in savings — primarily from ${topSaving?.recommendedAction?.toLowerCase() ?? "plan right-sizing"}. The biggest wins come from eliminating redundant tools and matching plan tier to actual team size. Credex can help you access discounted credits to capture even more of that saving on top of these optimisations.`
      : totalMonthlySaving > 0
      ? `Your AI stack is mostly well-optimised. We found $${totalMonthlySaving}/month in potential savings through plan adjustments. Keep an eye on seat utilisation as your team grows — that's typically where quiet overspend builds up.`
      : `You're spending well. No obvious savings found based on your current plans and team size. We'll notify you when new optimisations apply to your stack.`;

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