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
      { value: "individual", label: "Individual ($10/mo)", pricePerSeat: 10 },
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
      { value: "max", label: "Max ($100/mo)", pricePerSeat: 100 },
      { value: "team", label: "Team ($30/mo)", pricePerSeat: 30 },
      { value: "enterprise", label: "Enterprise (custom)", pricePerSeat: null },
      { value: "api_direct", label: "API Direct (usage-based)", pricePerSeat: null },
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
      { value: "api_direct", label: "API Direct (usage-based)", pricePerSeat: null },
    ],
  },
  {
    id: "anthropic_api",
    name: "Anthropic API",
    vendor: "Anthropic",
    color: "#c2410c",
    plans: [
      { value: "pay_as_you_go", label: "Pay-as-you-go", pricePerSeat: null },
      { value: "committed", label: "Committed (discounted)", pricePerSeat: null },
    ],
  },
  {
    id: "openai_api",
    name: "OpenAI API",
    vendor: "OpenAI",
    color: "#059669",
    plans: [
      { value: "pay_as_you_go", label: "Pay-as-you-go", pricePerSeat: null },
      { value: "committed", label: "Committed (discounted)", pricePerSeat: null },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    color: "#4285f4",
    plans: [
      { value: "pro", label: "Gemini Advanced / Pro ($20/mo)", pricePerSeat: 20 },
      { value: "ultra", label: "Ultra / One AI Premium ($20/mo)", pricePerSeat: 20 },
      { value: "api", label: "API (usage-based)", pricePerSeat: null },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf / v0",
    vendor: "Codeium / Vercel",
    color: "#7c3aed",
    plans: [
      { value: "free", label: "Free", pricePerSeat: 0 },
      { value: "pro", label: "Pro ($15/mo)", pricePerSeat: 15 },
      { value: "teams", label: "Teams ($35/mo)", pricePerSeat: 35 },
      { value: "enterprise", label: "Enterprise (custom)", pricePerSeat: null },
    ],
  },
];

/** Quick lookup map by ToolId */
export const TOOLS_MAP = Object.fromEntries(
  TOOLS_CONFIG.map((t) => [t.id, t])
) as Record<ToolId, ToolConfig>;
