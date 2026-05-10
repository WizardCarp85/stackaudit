import AuditResultPage from "@/features/AuditResult/AuditResultPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ResultDetailPage({ params }: Props) {
  const { id } = await params;
  return <AuditResultPage id={id} />;
}
