"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSavings from "./HeroSavings";
import ToolRecommendationCard from "./ToolRecommendationCard";
import AiSummaryCard from "./AiSummaryCard";
import { supabase } from "@/lib/supabase";
import { FaRegChartBar } from "react-icons/fa";
import Link from "next/link";
import { ToolRecommendation } from "@/lib/types";

interface AuditRow {
  recommendations: ToolRecommendation[];
  total_monthly_spend: number;
  total_monthly_saving: number;
  total_annual_saving: number;
  ai_summary: string;
}

interface Props {
  id: string;
}

export default function SharePage({ id }: Props) {
  const [data, setData] = useState<AuditRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAudit() {
      const { data: audit, error: supabaseError } = await supabase
        .from("audits")
        .select("*")
        .eq("id", id)
        .single();

      if (supabaseError) {
        console.error("Error fetching shareable audit:", supabaseError);
        setError(supabaseError.message);
      } else {
        setData(audit);
      }
      setLoading(false);
    }
    fetchAudit();
  }, [id]);

  if (loading) return null;

  if (!data) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600">Audit result not found</h1>
          <p className="text-gray-500 mt-2">
            {error ? `Database Error: ${error}` : "This link may have expired or is incorrect."}
          </p>
          {error?.includes("relation") && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl max-w-md mx-auto text-sm text-yellow-800">
              <strong>Fix:</strong> It looks like the &apos;audits&apos; table is missing. Did you run the SQL in your Supabase dashboard?
            </div>
          )}
          <Link href="/audit" className="mt-8 inline-block bg-[#20714b] text-white px-6 py-3 rounded-full font-bold">
            Run your own audit
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const enabledCount = data.recommendations.length;

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-[#fafaf8]">
      <Navbar />
      <main className="flex-1 pt-28 pb-24 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <span className="inline-flex items-center gap-2 bg-[#20714b]/10 border border-[#20714b]/30 rounded-full px-4 py-1.5 text-sm font-medium text-[#20714b]">
              <FaRegChartBar className="text-xs" />
              Shared Audit Results
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
              AI Stack Optimization Report
            </h1>
            <p className="text-gray-500 text-sm">
              {enabledCount} tools audited · Anonymous report
            </p>
          </div>

          <HeroSavings
            totalMonthlySpend={data.total_monthly_spend}
            totalMonthlySaving={data.total_monthly_saving}
            totalAnnualSaving={data.total_annual_saving}
          />

          <AiSummaryCard summary={data.ai_summary} />

          <section>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-widest mb-4">
              Recommendations
            </h2>
            <div className="flex flex-col gap-4">
              {data.recommendations.map((rec: ToolRecommendation, i: number) => (
                <ToolRecommendationCard key={rec.toolId} rec={rec} index={i} />
              ))}
            </div>
          </section>

          <div className="bg-gray-950 rounded-2xl p-8 text-center text-white space-y-6">
            <h3 className="text-xl font-bold">Want to audit your own AI stack?</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Get a breakdown of your team&apos;s AI spend and discover how to save thousands per year.
            </p>
            <Link
              href="/audit"
              className="inline-block bg-[#20714b] hover:bg-[#185e3e] text-white font-bold px-10 py-4 rounded-full transition-all hover:scale-105"
            >
              Start free audit
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
