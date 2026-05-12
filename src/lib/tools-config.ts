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
}

export const TOOLS_CONFIG: ToolConfig[] = [
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
  },
  {
    id: "github_copilot",
    name: "GitHub Copilot",
    vendor: "GitHub / Microsoft",
    color: "#24292e",
    plans: [
      { value: "pro", label: "Pro ($10/mo)", pricePerSeat: 10 },
      { value: "business", label: "Business ($19/mo)", pricePerSeat: 19 },
      { value: "enterprise", label: "Enterprise ($39/mo)", pricePerSeat: 39 },
    ],
  },
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
  },
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
  },
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
  },
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
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    color: "#4285f4",
    plans: [
      { value: "pro", label: "Pro ($19.99/mo)", pricePerSeat: 19.99 },
      { value: "ultra", label: "Ultra ($249.99/mo)", pricePerSeat: 249.99 },
      { value: "api_pro", label: "Gemini 3.1 Pro ($2/$12 per 1M tokens)", pricePerSeat: null },
      { value: "api_flash", label: "Gemini 3.1 Flash ($0.25/$1.50 per 1M tokens)", pricePerSeat: null },
    ],
  },
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
  },
];

/** Quick lookup map by ToolId */
export const TOOLS_MAP = Object.fromEntries(
  TOOLS_CONFIG.map((t) => [t.id, t])
) as Record<ToolId, ToolConfig>;
