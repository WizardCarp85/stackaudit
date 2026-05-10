import type { Metadata } from "next";
import AuditHistoryPage from "@/features/AuditHistory/AuditHistoryPage";

export const metadata: Metadata = {
  title: "Audit History — StackAudit",
  description:
    "View all your past AI spend audits. Click any audit to see the full breakdown, savings recommendations, and AI summary.",
  openGraph: {
    title: "My AI Audit History — StackAudit",
    description: "All my AI spend audits in one place.",
    type: "website",
  },
};

export default function ResultPage() {
  return <AuditHistoryPage />;
}
