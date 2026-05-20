export interface ToolChange {
  toolName: string;
  oldPrice: number;
  newPrice: number;
}

export interface AuditUpdate {
  auditId: string;
  auditName: string;
  date: string;
  toolChanges: ToolChange[];
  impactDescription: string;
  newTotalSaving: number;
}

export function generatePricingUpdateEmailHtml(updates: AuditUpdate[], baseUrl: string): string {
  const auditCardsHtml = updates
    .map((update) => {
      const toolChangesHtml = update.toolChanges
        .map(
          (tc) => `
            <li style="margin-bottom: 4px;">
              <strong>${tc.toolName}</strong> pricing changed 
              ${tc.oldPrice !== undefined ? `from $${tc.oldPrice}/seat` : ""} 
              to <strong>$${tc.newPrice ?? "unknown"}/seat</strong>
            </li>`
        )
        .join("");

      return `
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin-top: 0; margin-bottom: 8px; color: #111827; font-size: 18px;">
            ${update.auditName}
          </h3>
          <p style="margin-top: 0; margin-bottom: 16px; color: #6b7280; font-size: 14px;">
            Audited on ${update.date}
          </p>
          
          <h4 style="margin-top: 0; margin-bottom: 8px; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">What Changed</h4>
          <ul style="margin-top: 0; margin-bottom: 16px; color: #4b5563; font-size: 15px; padding-left: 20px;">
            ${toolChangesHtml}
          </ul>

          <h4 style="margin-top: 0; margin-bottom: 8px; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">How it affects you</h4>
          <p style="margin-top: 0; margin-bottom: 24px; color: #4b5563; font-size: 15px; line-height: 1.5;">
            ${update.impactDescription}
          </p>

          <a href="${baseUrl}/result/${update.auditId}?edit=true" style="display: inline-block; background-color: #20714b; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 9999px; font-size: 15px;">
            Review & Re-run Audit &rarr;
          </a>
        </div>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>AI Tools Pricing Update</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafaf8; margin: 0; padding: 40px 20px;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-w-600px; width: 100%;">
              <tr>
                <td align="left">
                  <h1 style="color: #111827; font-size: 24px; margin-top: 0; margin-bottom: 16px;">
                    Pricing updates detected in your AI stack
                  </h1>
                  <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 32px;">
                    We noticed that some of the tools you are using have recently updated their pricing or plans. We've automatically re-calculated your savings opportunities below.
                  </p>
                  
                  ${auditCardsHtml}
                  
                  <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-top: 40px; margin-bottom: 24px;">
                  <p style="color: #9ca3af; font-size: 13px; text-align: center;">
                    You are receiving this because you opted into updates at StackAudit.<br>
                    Run a new free audit at <a href="${baseUrl}" style="color: #20714b;">StackAudit</a>.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
