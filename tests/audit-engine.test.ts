import { runAudit } from "../src/lib/audit-engine";
import { AuditFormState } from "../src/lib/types";

const createBaseForm = (): AuditFormState => ({
  teamSize: "10",
  companyName: "Test Co",
  email: "test@example.com",
  tools: {
    cursor: { toolId: "cursor", enabled: false, plan: "pro", monthlySpend: "0", seats: "0", useCase: "coding" },
    github_copilot: { toolId: "github_copilot", enabled: false, plan: "business", monthlySpend: "0", seats: "0", useCase: "coding" },
    claude: { toolId: "claude", enabled: false, plan: "pro", monthlySpend: "0", seats: "0", useCase: "mixed" },
    chatgpt: { toolId: "chatgpt", enabled: false, plan: "plus", monthlySpend: "0", seats: "0", useCase: "mixed" },
    anthropic_api: { toolId: "anthropic_api", enabled: false, plan: "sonnet_4_6", monthlySpend: "0", seats: "0", useCase: "coding" },
    openai_api: { toolId: "openai_api", enabled: false, plan: "gpt_5_4", monthlySpend: "0", seats: "0", useCase: "coding" },
    gemini: { toolId: "gemini", enabled: false, plan: "pro", monthlySpend: "0", seats: "0", useCase: "mixed" },
    windsurf: { toolId: "windsurf", enabled: false, plan: "pro", monthlySpend: "0", seats: "0", useCase: "coding" },
  },
});

describe("Audit Engine Tests", () => {
  test("Cursor Downgrade: recommends Pro when on Business with < 5 seats", () => {
    const form = createBaseForm();
    form.teamSize = "3";
    form.tools.cursor = {
      toolId: "cursor",
      enabled: true,
      plan: "business",
      monthlySpend: "120",
      seats: "3",
      useCase: "coding",
    };

    const result = runAudit(form);
    const cursorRec = result.recommendations.find((r) => r.toolId === "cursor");

    expect(cursorRec?.recommendedAction).toContain("Downgrade to Cursor Pro");
    expect(cursorRec?.potentialSaving).toBe(3 * (40 - 20)); // $20 saving per seat
  });

  test("Cursor Overlap: recommends dropping Copilot if Cursor is also active", () => {
    const form = createBaseForm();
    form.tools.cursor = {
      toolId: "cursor",
      enabled: true,
      plan: "pro",
      monthlySpend: "20",
      seats: "1",
      useCase: "coding",
    };
    form.tools.github_copilot = {
      toolId: "github_copilot",
      enabled: true,
      plan: "business",
      monthlySpend: "19",
      seats: "1",
      useCase: "coding",
    };

    const result = runAudit(form);
    const copilotRec = result.recommendations.find((r) => r.toolId === "github_copilot");

    expect(copilotRec?.recommendedAction).toContain("Drop GitHub Copilot");
    expect(copilotRec?.potentialSaving).toBe(19);
  });

  test("Cursor Right-sizing: recommends reducing seats when seats > teamSize", () => {
    const form = createBaseForm();
    form.teamSize = "5";
    form.tools.cursor = {
      toolId: "cursor",
      enabled: true,
      plan: "pro",
      monthlySpend: "160",
      seats: "8",
      useCase: "coding",
    };

    const result = runAudit(form);
    const cursorRec = result.recommendations.find((r) => r.toolId === "cursor");

    expect(cursorRec?.recommendedAction).toContain("Reduce to 5 seats");
    expect(cursorRec?.potentialSaving).toBe((8 - 5) * 20);
  });

  test("GitHub Copilot Downgrade: recommends Business when on Enterprise with < 10 seats", () => {
    const form = createBaseForm();
    form.teamSize = "5";
    form.tools.github_copilot = {
      toolId: "github_copilot",
      enabled: true,
      plan: "enterprise",
      monthlySpend: "195",
      seats: "5",
      useCase: "coding",
    };

    const result = runAudit(form);
    const copilotRec = result.recommendations.find((r) => r.toolId === "github_copilot");

    expect(copilotRec?.recommendedAction).toContain("Downgrade to Copilot Business");
    expect(copilotRec?.potentialSaving).toBe(5 * (39 - 19));
  });

  test("Empty Audit: returns zero savings when no tools are enabled", () => {
    const form = createBaseForm();
    const result = runAudit(form);

    expect(result.totalMonthlySpend).toBe(0);
    expect(result.totalMonthlySaving).toBe(0);
    expect(result.recommendations.length).toBe(0);
  });
});
