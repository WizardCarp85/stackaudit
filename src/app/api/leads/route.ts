import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, companyName, role, teamSize, metadata } = await request.json();

    // 1. Basic validation
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // 2. Save to Supabase
    const { error: supabaseError } = await supabase.from("leads").insert([
      {
        email,
        company_name: companyName,
        role,
        team_size: teamSize,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
      },
    ]);

    if (supabaseError) {
      console.error("[api/leads] Supabase error:", supabaseError);
      // We continue anyway to try and send the email
    }

    // 3. Send transactional email via Resend
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("re_your")) {
      try {
        await resend.emails.send({
          from: "StackAudit <hello@resend.dev>", // Replace with your verified domain
          to: email,
          subject: "Your AI Stack Audit is ready!",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 12px;">
              <h2 style="color: #20714b;">Your AI Stack Audit is Complete</h2>
              <p>Hello,</p>
              <p>Thank you for using StackAudit. We've received your request and your audit report is now accessible via your browser history.</p>
              <p><strong>Next steps:</strong></p>
              <ul>
                <li>Review the recommended plan downgrades.</li>
                <li>Check for tool overlaps (e.g., Cursor vs Copilot).</li>
                <li>Stay tuned—we'll reach out if we find more specific savings for ${companyName || "your team"}.</li>
              </ul>
              <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="font-size: 12px; color: #6b7280;">StackAudit is a free tool by Credex.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("[api/leads] Resend error:", emailError);
      }
    } else {
      console.warn("[api/leads] Skipping email: RESEND_API_KEY is not configured.");
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[api/leads] Unexpected error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
