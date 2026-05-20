import { runAudit } from "../src/lib/audit-engine";
import { AuditFormState } from "../src/lib/types";

const createBaseForm = (): AuditFormState => ({
  teamSize: "10",
  companyName: "Test Co",
  email: "test@example.com",
  tools: [],
});

describe("Audit Engine Tests", () => {
  test("Cursor Downgrade: recommends Pro when on Business with < 5 seats", () => {
    const form = createBaseForm();
    form.teamSize = "3";
    form.tools.push({
      instanceId: "cursor-1",
      toolId: "cursor",
      plan: "business",
      monthlySpend: "120",
      seats: "3",
      useCase: "coding",
    });

    const result = runAudit(form);
    const cursorRec = result.recommendations.find((r) => r.toolId === "cursor");

    expect(cursorRec?.recommendedAction).toContain("Downgrade to Cursor Pro");
    expect(cursorRec?.potentialSaving).toBe(3 * (40 - 20)); // $20 saving per seat
  });

  test("Cursor Overlap: recommends dropping Copilot if Cursor is also active", () => {
    const form = createBaseForm();
    form.tools.push({
      instanceId: "cursor-1",
      toolId: "cursor",
      plan: "pro",
      monthlySpend: "20",
      seats: "1",
      useCase: "coding",
    });
    form.tools.push({
      instanceId: "copilot-1",
      toolId: "github_copilot",
      plan: "business",
      monthlySpend: "19",
      seats: "1",
      useCase: "coding",
    });

    const result = runAudit(form);
    const copilotRec = result.recommendations.find((r) => r.toolId === "github_copilot");

    expect(copilotRec?.recommendedAction).toContain("Drop GitHub Copilot");
    expect(copilotRec?.potentialSaving).toBe(19);
  });

  test("Cursor Right-sizing: recommends reducing seats when seats > teamSize", () => {
    const form = createBaseForm();
    form.teamSize = "5";
    form.tools.push({
      instanceId: "cursor-1",
      toolId: "cursor",
      plan: "pro",
      monthlySpend: "160",
      seats: "8",
      useCase: "coding",
    });

    const result = runAudit(form);
    const cursorRec = result.recommendations.find((r) => r.toolId === "cursor");

    expect(cursorRec?.recommendedAction).toContain("Reduce to 5 seats");
    expect(cursorRec?.potentialSaving).toBe((8 - 5) * 20);
  });

  test("GitHub Copilot Downgrade: recommends Business when on Enterprise with < 10 seats", () => {
    const form = createBaseForm();
    form.teamSize = "5";
    form.tools.push({
      instanceId: "copilot-1",
      toolId: "github_copilot",
      plan: "enterprise",
      monthlySpend: "195",
      seats: "5",
      useCase: "coding",
    });

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
