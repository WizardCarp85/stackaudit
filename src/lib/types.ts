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

// ─── Declarative Audit Rules ───────────────────────────────────────────────────

export interface AuditRules {
  /** Drop this tool if any of these tools are also active */
  overlapWith?: { toolId: ToolId; message: string }[];
  /** If the use case isn't in this list, recommend switching */
  idealUseCases?: { cases: string[]; alternative: string; message: string };
  /** E.g. "business" needs 5 seats, else fallback to "pro" */
  minSeatsForPlan?: Record<string, { minSeats: number; fallbackPlan: string; message: string }>;
  /** Unconditional downgrades (e.g. always downgrade from Ultra to Pro unless needed) */
  fixedDowngrades?: Record<string, { fallbackPlan: string; message: string }>;
  /** API optimisations based on spend thresholds */
  apiOptimizations?: Record<
    string,
    { threshold: number; alternativePlan: string; savingMultiplier: number; message: string }
  >;
}

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
  /** Custom name for this audit (optional) */
  auditName: string;
  /** Email for lead capture */
  email: string;
  /** ID of the original audit if this form was pre-filled via Edit/Rerun */
  originalAuditId?: string;
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
  /** Snapshot of TOOLS_CONFIG used during evaluation */
  pricingSnapshot?: any[];
  /** Flag for when pricing has changed */
  pricingOutdated?: boolean;
  /** Flag for when this audit was created via an edit/update */
  isUpdated?: boolean;
}
