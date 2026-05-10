import type { Metadata } from "next";
import AuditFormPage from "@/features/AuditForm/AuditFormPage";

export const metadata: Metadata = {
  title: "Audit My AI Stack — StackAudit",
  description:
    "Tell us which AI tools your team uses and how much you spend. We'll find where you're overpaying and surface smarter alternatives — free, in under 3 minutes.",
  openGraph: {
    title: "Audit My AI Stack — StackAudit",
    description: "Free AI spend audit. Find your savings in under 3 minutes.",
    type: "website",
  },
};

export default function AuditPage() {
  return <AuditFormPage />;
}
