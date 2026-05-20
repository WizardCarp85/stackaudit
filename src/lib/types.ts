// ─── Tool identifiers ────────────────────────────────────────────────────────

export type ToolId =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

// ─── Per-tool form entry ──────────────────────────────────────────────────────

export interface ToolEntry {
  /** Unique ID for this specific added instance of the tool */
  instanceId: string;
  /** Which tool this entry is for */
  toolId: ToolId;
  /** Selected plan slug (e.g. "hobby", "pro", "business", "enterprise") */
  plan: string;
  /** Monthly spend in USD */
  monthlySpend: string;
  /** Number of seats / licences */
  seats: string;
  /** Primary use-case */
  useCase: "coding" | "writing" | "data" | "research" | "mixed" | "";
}

// ─── Whole-form state ─────────────────────────────────────────────────────────

export interface AuditFormState {
  /** Tool entries added by the user */
  tools: ToolEntry[];
  /** Total team size */
  teamSize: string;
  /** Company name (optional) */
  companyName: string;
  /** Email for lead capture */
  email: string;
}

// ─── Audit result types (populated by the audit engine, not the form) ─────────

export interface ToolRecommendation {
  toolId: ToolId;
  currentSpend: number;
  recommendedAction: string;
  potentialSaving: number;
  reason: string;
}

export interface AuditResult {
  /** Unique ID — used as the URL slug and history key */
  id: string;
  /** Input that produced this audit */
  formState: AuditFormState;
  /** Per-tool breakdown */
  recommendations: ToolRecommendation[];
  /** Computed totals */
  totalMonthlySpend: number;
  totalMonthlySaving: number;
  totalAnnualSaving: number;
  /** AI-generated summary paragraph (or templated fallback) */
  aiSummary: string;
  /** ISO timestamp */
  auditedAt: string;
}
