import { supabase } from "@/lib/supabase";
import type { AuditResult } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const result = (await request.json()) as AuditResult;

    // Validation
    if (!result.recommendations || typeof result.totalMonthlySaving !== "number") {
      return Response.json({ error: "Invalid audit result" }, { status: 400 });
    }

    // Save to Supabase (Omit formState to strip PII like companyName)
    const { data, error } = await supabase
      .from("audits")
      .insert([
        {
          recommendations: result.recommendations,
          total_monthly_spend: result.totalMonthlySpend,
          total_monthly_saving: result.totalMonthlySaving,
          total_annual_saving: result.totalAnnualSaving,
          ai_summary: result.aiSummary,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("[api/audits] Supabase error:", error);
      return Response.json({ error: "Failed to save shareable audit" }, { status: 500 });
    }

    return Response.json({ id: data.id });
  } catch (err) {
    console.error("[api/audits] Unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
