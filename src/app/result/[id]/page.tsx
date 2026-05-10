import type { Metadata } from "next";
import AuditResultPage from "@/features/AuditResult/AuditResultPage";

export const metadata: Metadata = {
  title: "Audit Result — StackAudit",
  description:
    "Your AI stack audit: per-tool recommendations, total monthly and annual savings, and an AI-generated summary.",
  openGraph: {
    title: "My AI Stack Audit — StackAudit",
    description: "I just audited my AI spend with StackAudit. Here's what I found.",
    type: "website",
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ResultDetailPage({ params }: Props) {
  const { id } = await params;
  return <AuditResultPage id={id} />;
}
