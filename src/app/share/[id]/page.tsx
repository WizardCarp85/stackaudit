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
    title: `AI Stack Audit — We Found ${savings} in Potential Annual Savings`,
    description: `Stop overpaying for AI! Our audit found ${savings} in potential annual savings for this stack. Run your own free 3-minute audit to optimize your team's spend.`,
    openGraph: {
      title: `AI Stack Audit — We Found ${savings} in Potential Annual Savings`,
      description: `Stop overpaying for AI! Our audit found ${savings} in potential annual savings for this stack. Run your own free 3-minute audit to optimize your team's spend.`,
      images: [{ url: "/og-image.png" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `AI Stack Audit — We Found ${savings} in Potential Annual Savings`,
      description: `Stop overpaying for AI! Our audit found ${savings} in potential annual savings for this stack. Run your own free 3-minute audit to optimize your team's spend.`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <SharePage id={id} />;
}
