import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TOOLS_CONFIG, ToolConfig } from "@/lib/tools-config";

export async function GET() {
  try {
    // 1. Fetch audits that haven't been flagged yet
    const { data: audits, error } = await supabase
      .from("audits")
      .select("id, pricing_snapshot, form_state")
      .eq("pricing_outdated", false);

    if (error) throw error;
    if (!audits || audits.length === 0) {
      return NextResponse.json({ message: "No audits to check", auditsChecked: 0 });
    }

    let flaggedCount = 0;
    const flaggedIds: string[] = [];

    // Helper to get current price for a tool and plan
    const getCurrentPrice = (toolId: string, planValue: string) => {
      const tool = TOOLS_CONFIG.find(t => t.id === toolId);
      if (!tool) return undefined; // Tool was removed from system
      const plan = tool.plans.find(p => p.value === planValue);
      return plan?.pricePerSeat; // Might be undefined if plan removed
    };

    for (const audit of audits) {
      const snapshot: ToolConfig[] = audit.pricing_snapshot || [];
      const formState = audit.form_state;
      let hasChanged = false;

      // Check the specific tools the user had in their form
      if (formState && formState.tools) {
        for (const entry of formState.tools) {
          // Find what the price *was* in the snapshot
          const snapTool = snapshot.find((t: any) => t.id === entry.toolId);
          const snapPlan = snapTool?.plans.find((p: any) => p.value === entry.plan);
          const oldPrice = snapPlan?.pricePerSeat;

          // Find what the price is *now*
          const currentPrice = getCurrentPrice(entry.toolId, entry.plan);

          // If the plan doesn't exist anymore, or the price changed
          if (currentPrice === undefined || currentPrice !== oldPrice) {
            hasChanged = true;
            break; // No need to check other tools for this audit
          }
        }
      }

      if (hasChanged) {
        flaggedCount++;
        flaggedIds.push(audit.id);
      }
    }

    // 2. Batch update flagged audits
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
      auditsFlagged: flaggedCount,
    });
  } catch (err: any) {
    console.error("Detect changes error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
