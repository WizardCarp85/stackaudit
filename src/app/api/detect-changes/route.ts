import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TOOLS_CONFIG } from "@/lib/tools-config";
import { runAudit } from "@/lib/audit-engine";
import { generatePricingUpdateEmailHtml, AuditUpdate, ToolChange } from "@/lib/email-templates";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "updates@stackaudit-one.vercel.app";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stackaudit-one.vercel.app";

export async function GET() {
  // Simple auth check for cron jobs if needed (e.g. ?cron_key=secret)
  // For now, left open or protected by Vercel cron auth
  try {
    // 1. Fetch audits that haven't been flagged yet AND have an email
    const { data: audits, error } = await supabase
      .from("audits")
      .select("*")
      .eq("pricing_outdated", false)
      .not("email", "is", null)
      .not("email", "eq", "");

    if (error) throw error;
    if (!audits || audits.length === 0) {
      return NextResponse.json({ message: "No audits to check", auditsChecked: 0 });
    }

    const updatesByEmail: Record<string, AuditUpdate[]> = {};
    const flaggedIds: string[] = [];

    // Helper to get current price
    const getCurrentPrice = (toolId: string, planValue: string) => {
      const tool = TOOLS_CONFIG.find((t) => t.id === toolId);
      if (!tool) return undefined;
      const plan = tool.plans.find((p) => p.value === planValue);
      return plan?.pricePerSeat;
    };

    // 2. Evaluate each audit
    for (const audit of audits) {
      const snapshot: any[] = audit.pricing_snapshot || [];
      const formState = audit.form_state;
      const oldRecommendations = audit.recommendations || [];
      
      let hasChanged = false;
      const toolChanges: ToolChange[] = [];

      if (formState && formState.tools) {
        for (const entry of formState.tools) {
          const snapTool = snapshot.find((t: any) => t.id === entry.toolId);
          const snapPlan = snapTool?.plans.find((p: any) => p.value === entry.plan);
          const oldPrice = snapPlan?.pricePerSeat;
          const currentPrice = getCurrentPrice(entry.toolId, entry.plan);
          const toolName = TOOLS_CONFIG.find(t => t.id === entry.toolId)?.name || entry.toolId;

          if (currentPrice !== oldPrice) {
            hasChanged = true;
            toolChanges.push({
              toolName,
              oldPrice: oldPrice ?? 0,
              newPrice: currentPrice ?? 0,
            });
          }
        }
      }

      if (hasChanged) {
        flaggedIds.push(audit.id);

        // Run the audit engine with CURRENT pricing to get new recommendations
        const newResult = runAudit(formState, audit.id);
        
        const oldSaving = oldRecommendations.reduce((sum: number, r: any) => sum + (r.potentialSaving || 0), 0);
        const newSaving = newResult.totalMonthlySaving;
        
        let impactDescription = "";
        if (newSaving > oldSaving) {
          impactDescription = `Great news! The recent pricing changes mean you could now save $${newSaving}/mo (up from $${oldSaving}/mo). We highly recommend reviewing your updated stack.`;
        } else if (newSaving < oldSaving) {
          impactDescription = `The recent pricing changes have reduced your potential savings from $${oldSaving}/mo to $${newSaving}/mo. It might be time to switch tools.`;
        } else {
          impactDescription = `Prices have updated, but your overall potential saving remains at $${newSaving}/mo. We still recommend following our original suggestions.`;
        }

        const updateData: AuditUpdate = {
          auditId: audit.id,
          auditName: formState.auditName || (formState.companyName ? `${formState.companyName}'s Audit` : "Unnamed Audit"),
          date: new Date(audit.created_at).toLocaleDateString(),
          toolChanges,
          impactDescription,
          newTotalSaving: newSaving,
        };

        if (!updatesByEmail[audit.email]) {
          updatesByEmail[audit.email] = [];
        }
        updatesByEmail[audit.email].push(updateData);
      }
    }

    // 3. Dispatch Emails via Resend Native Fetch
    const emailsSent = [];
    const emailErrors = [];

    if (RESEND_API_KEY) {
      for (const [email, updates] of Object.entries(updatesByEmail)) {
        const html = generatePricingUpdateEmailHtml(updates, BASE_URL);
        
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: `StackAudit Updates <${FROM_EMAIL}>`,
              to: [email],
              subject: "Pricing updates detected in your AI stack",
              html: html,
            }),
          });
          
          if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`Resend API Error: ${res.status} - ${errBody}`);
          }
          emailsSent.push(email);
        } catch (e: any) {
          console.error(`Failed to send email to ${email}:`, e);
          emailErrors.push({ email, error: e.message });
        }
      }
    } else {
      console.warn("No RESEND_API_KEY found, skipping email dispatch.");
    }

    // 4. Update DB to mark as outdated
    if (flaggedIds.length > 0) {
      const { error: updateError } = await supabase
        .from("audits")
        .update({ pricing_outdated: true })
        .in("id", flaggedIds);

      if (updateError) throw updateError;
    }

    return NextResponse.json({
      success: true,
      auditsChecked: audits.length,
      auditsFlagged: flaggedIds.length,
      emailsSent: emailsSent.length,
      emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
    });
  } catch (err: any) {
    console.error("Detect changes error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
