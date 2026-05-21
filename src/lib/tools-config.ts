import type { ToolId } from "./types";

export interface PlanOption {
  value: string;
  label: string;
  /** Typical price per seat/month in USD, null if API-usage-based */
  pricePerSeat: number | null;
}

export interface ToolConfig {
  id: ToolId;
  name: string;
  vendor: string;
  /** CSS color for the tool badge */
  color: string;
  plans: PlanOption[];
  auditRules: import("./types").AuditRules;
}

export const TOOLS_CONFIG: ToolConfig[] = [
  // cursor
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Anysphere",
    color: "#6366f1",
    plans: [
      { value: "hobby", label: "Hobby (Free)", pricePerSeat: 0 },
      { value: "pro", label: "Pro ($20/mo)", pricePerSeat: 20 },
      { value: "business", label: "Business ($40/mo)", pricePerSeat: 40 },
      { value: "enterprise", label: "Enterprise (custom)", pricePerSeat: null },
    ],
    auditRules: {
      idealUseCases: { cases: ["coding", "mixed", ""], alternative: "Claude Pro or ChatGPT Plus", message: "Cursor is optimised for code editing in an IDE. For {useCase} workflows, Claude Pro ($20/mo) or ChatGPT Plus ($20/mo) provides better value." },
      minSeatsForPlan: {
        business: { minSeats: 5, fallbackPlan: "pro", message: "Business plan ($40/seat) adds SSO and centralised billing — overkill for <5 devs. Pro ($20/seat) covers all coding features." }
      }
    }
  },
  // github-copilot
  {
    id: "github_copilot",
    name: "GitHub Copilot",
    vendor: "GitHub / Microsoft",
    color: "#2563eb",
    plans: [
      { value: "pro", label: "Pro ($10/mo)", pricePerSeat: 10 },
      { value: "business", label: "Business ($19/mo)", pricePerSeat: 19 },
      { value: "enterprise", label: "Enterprise ($39/mo)", pricePerSeat: 39 },
    ],
    auditRules: {
      overlapWith: [{ toolId: "cursor", message: "Cursor and GitHub Copilot both provide AI code completion in the IDE. Running both is redundant. Cursor Pro ($20/seat) has broader model access." }],
      idealUseCases: { cases: ["coding", "mixed", ""], alternative: "Claude Pro or ChatGPT Plus", message: "GitHub Copilot only works inside code editors. For {useCase} tasks, Claude Pro ($20/mo) or ChatGPT Plus ($20/mo) is far more useful." },
      minSeatsForPlan: {
        enterprise: { minSeats: 10, fallbackPlan: "business", message: "Copilot Enterprise ($39/seat) adds audit logs and org-wide policies — valuable only for 10+ seat compliance needs. Business ($19/seat) covers all AI coding features." }
      }
    }
  },
  // claude
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    color: "#d97706",
    plans: [
      { value: "free", label: "Free", pricePerSeat: 0 },
      { value: "pro", label: "Pro ($20/mo)", pricePerSeat: 20 },
      { value: "team_standard", label: "Team Standard ($25/mo)", pricePerSeat: 25 },
      { value: "team_premium", label: "Team Premium ($125/mo)", pricePerSeat: 125 },
      { value: "enterprise", label: "Enterprise ($20/mo + API usage)", pricePerSeat: 20 },
    ],
    auditRules: {
      minSeatsForPlan: {
        team_standard: { minSeats: 3, fallbackPlan: "pro", message: "Claude Team ($25/seat) requires min 5 seats and adds admin controls. For {seats} users, individual Pro plans at $20/seat saves money." },
        team_premium: { minSeats: 3, fallbackPlan: "pro", message: "Claude Team ($125/seat) adds admin controls. For {seats} users, individual Pro plans at $20/seat saves money." }
      },
      fixedDowngrades: {
        team_premium: { fallbackPlan: "team_standard", message: "Team Premium ($125/seat) is for heavy power users hitting rate limits. Team Standard ($25/seat) covers most teams." }
      }
    }
  },
  // chatgpt
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    color: "#10a37f",
    plans: [
      { value: "plus", label: "Plus ($20/mo)", pricePerSeat: 20 },
      { value: "team", label: "Team ($30/mo)", pricePerSeat: 30 },
      { value: "enterprise", label: "Enterprise (custom)", pricePerSeat: null },
    ],
    auditRules: {
      overlapWith: [{ toolId: "claude", message: "Claude and ChatGPT are near-equivalent for {useCase} tasks. Running both is redundant. Consolidate to one." }],
      minSeatsForPlan: {
        team: { minSeats: 3, fallbackPlan: "plus", message: "ChatGPT Team ($30/seat) adds shared workspace and admin tools. For {seats} users, individual Plus plans save money with no real loss of features." }
      }
    }
  },
  // anthropid_api
  {
    id: "anthropic_api",
    name: "Anthropic API",
    vendor: "Anthropic",
    color: "#c2410c",
    plans: [
      { value: "sonnet_4_6", label: "Claude Sonnet 4.6 ($3/$15 per 1M tokens)", pricePerSeat: null },
      { value: "opus_4_7", label: "Claude Opus 4.7 ($5/$25 per 1M tokens)", pricePerSeat: null },
      { value: "haiku_4_5", label: "Claude Haiku 4.5 ($1/$5 per 1M tokens)", pricePerSeat: null },
    ],
    auditRules: {
      apiOptimizations: {
        opus_4_7: { threshold: 100, alternativePlan: "sonnet_4_6", savingMultiplier: 0.4, message: "Sonnet 4.6 ($3 input/$15 output per 1M tokens) is ~40% cheaper than Opus 4.7 ($5/$25) with near-equivalent quality for most tasks. Route complex reasoning to Opus, rest to Sonnet." },
        sonnet_4_6: { threshold: 200, alternativePlan: "haiku_4_5", savingMultiplier: 0.3, message: "Haiku 4.5 ($1 input/$5 output per 1M tokens) is ~67% cheaper than Sonnet 4.6. For classification, summarisation, or structured extraction, Haiku performs comparably." }
      }
    }
  },
  // openai_api
  {
    id: "openai_api",
    name: "OpenAI API",
    vendor: "OpenAI",
    color: "#059669",
    plans: [
      { value: "gpt_5_5", label: "GPT-5.5 ($5/$30 per 1M tokens)", pricePerSeat: null },
      { value: "gpt_5_4", label: "GPT-5.4 ($2.50/$15 per 1M tokens)", pricePerSeat: null },
      { value: "gpt_5_4_mini", label: "GPT-5.4 mini ($0.75/$4.50 per 1M tokens)", pricePerSeat: null },
    ],
    auditRules: {
      apiOptimizations: {
        gpt_5_5: { threshold: 100, alternativePlan: "gpt_5_4", savingMultiplier: 0.5, message: "GPT-5.4 ($2.50 input/$15 output per 1M tokens) is 50% cheaper than GPT-5.5 ($5/$30). Reserve 5.5 for complex chain-of-thought tasks." },
        gpt_5_4: { threshold: 150, alternativePlan: "gpt_5_4_mini", savingMultiplier: 0.35, message: "GPT-5.4 mini ($0.75 input/$4.50 output per 1M tokens) is ~70% cheaper than GPT-5.4. Good for classification, extraction, and short-form generation." }
      }
    }
  },
  // gemini
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    color: "#4285f4",
    plans: [
      { value: "pro", label: "Pro ($19.99/mo)", pricePerSeat: 199.99 },
      { value: "ultra", label: "Ultra ($249.99/mo)", pricePerSeat: 249.99 },
      { value: "api_pro", label: "Gemini 3.1 Pro ($2/$12 per 1M tokens)", pricePerSeat: null },
      { value: "api_flash", label: "Gemini 3.1 Flash ($0.25/$1.50 per 1M tokens)", pricePerSeat: null },
    ],
    auditRules: {
      idealUseCases: { cases: ["writing", "data", "research", "mixed", ""], alternative: "Cursor Pro or GitHub Copilot", message: "Gemini has no native IDE plugin for code completion. Cursor Pro ($20/seat) or GitHub Copilot ($10-19/seat) integrates directly into your editor, making them more effective for coding workflows." },
      fixedDowngrades: {
        ultra: { fallbackPlan: "pro", message: "Gemini Ultra ($249.99/mo) is designed for extreme multimodal and research tasks. Gemini Pro ($19.99/mo) handles coding, writing, and data tasks for most teams." }
      },
      apiOptimizations: {
        api_pro: { threshold: 100, alternativePlan: "api_flash", savingMultiplier: 0.5, message: "Gemini Flash ($0.25/$1.50 per 1M tokens) is ~88% cheaper than Gemini Pro ($2/$12). For non-reasoning tasks, Flash performs comparably." }
      }
    }
  },
  // windsurf
  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Codeium",
    color: "#7c3aed",
    plans: [
      { value: "free", label: "Free", pricePerSeat: 0 },
      { value: "pro", label: "Pro ($20/mo)", pricePerSeat: 20 },
      { value: "teams", label: "Teams ($40/mo)", pricePerSeat: 40 },
      { value: "enterprise", label: "Enterprise (custom)", pricePerSeat: null },
    ],
    auditRules: {
      overlapWith: [{ toolId: "cursor", message: "Cursor and Windsurf are both AI-first code editors with near-identical features. Running both wastes money. Pick one — Cursor has broader model access." }],
      minSeatsForPlan: {
        teams: { minSeats: 5, fallbackPlan: "pro", message: "Windsurf Teams ($40/seat) adds admin controls and centralised billing. For <5 devs, Pro ($20/seat) covers everything." }
      }
    }
  },
];

/** Quick lookup map by ToolId */
export const TOOLS_MAP = Object.fromEntries(
  TOOLS_CONFIG.map((t) => [t.id, t])
) as Record<ToolId, ToolConfig>;
