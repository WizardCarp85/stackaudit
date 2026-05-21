import { supabase } from "@/lib/supabase";
import type { AuditResult } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // Map back to AuditResult structure
    const audit: AuditResult = {
      id: data.id,
      formState: data.form_state,
      recommendations: data.recommendations,
      pricingSnapshot: data.pricing_snapshot,
      pricingOutdated: data.pricing_outdated,
      totalMonthlySpend: data.total_monthly_spend,
      totalMonthlySaving: data.total_monthly_saving,
      totalAnnualSaving: data.total_annual_saving,
      aiSummary: data.ai_summary,
      auditedAt: data.created_at,
    };

    return Response.json(audit);
  } catch (err) {
    console.error("[api/audits GET] Unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
      .upsert([
        {
          id: result.id,
          email: result.formState?.email || null,
          form_state: result.formState,
          recommendations: result.recommendations,
          pricing_snapshot: result.pricingSnapshot,
          pricing_outdated: result.pricingOutdated || false,
          total_monthly_spend: result.totalMonthlySpend,
          total_monthly_saving: result.totalMonthlySaving,
          total_annual_saving: result.totalAnnualSaving,
          ai_summary: result.aiSummary,
          created_at: result.auditedAt || new Date().toISOString(),
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

    const { error } = await supabase.from("audits").delete().eq("id", id);
    
    if (error) {
      console.error("[api/audits DELETE] Supabase error:", error);
      return Response.json({ error: "Failed to delete audit" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[api/audits DELETE] Unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
