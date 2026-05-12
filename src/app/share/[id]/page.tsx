import { Metadata } from "next";
import SharePage from "@/features/AuditResult/SharePage";
import { supabase } from "@/lib/supabase";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: audit } = await supabase
    .from("audits")
    .select("total_annual_saving")
    .eq("id", id)
    .single();

  const savings = audit?.total_annual_saving 
    ? `$${Math.round(audit.total_annual_saving).toLocaleString()}` 
    : "thousands";

  return {
    title: `AI Stack Audit — Potential Savings Found`,
    description: `We found ${savings} in potential annual AI savings. See the full breakdown on StackAudit.`,
    openGraph: {
      title: `AI Stack Audit — Potential Savings Found`,
      description: `We found ${savings} in potential annual AI savings. See the full breakdown on StackAudit.`,
      images: [{ url: "/og-image.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `AI Stack Audit — Potential Savings Found`,
      description: `We found ${savings} in potential annual AI savings. See the full breakdown on StackAudit.`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <SharePage id={id} />;
}
