"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSavings from "./HeroSavings";
import ToolRecommendationCard from "./ToolRecommendationCard";
import AiSummaryCard from "./AiSummaryCard";
import LeadCaptureSection from "./LeadCaptureSection";
import { getAuditById } from "@/lib/audit-history";
import type { AuditResult } from "@/lib/types";
import { FaArrowLeft, FaShare, FaSearch, FaRegChartBar, FaCheckCircle } from "react-icons/fa";

interface Props {
  /** The audit ID from the URL — e.g. /result/[id] */
  id: string;
}

export default function AuditResultPage({ id }: Props) {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const audit = getAuditById(id);
    if (audit) {
      setResult(audit);
    } else {
      setNotFound(true);
    }
  }, [id]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Not found state ──
  if (notFound) {
    return (
      <div className="min-h-screen font-sans antialiased bg-[#fafaf8]">
        <NavBar />
        <main className="pt-28 pb-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl px-8 py-20 flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-3xl text-gray-400">
                <FaSearch />
              </div>
              <div>
                <p className="text-gray-900 font-bold text-xl mb-2">Audit not found</p>
                <p className="text-gray-400 text-sm max-w-sm">
                  This audit doesn&apos;t exist or may have been deleted.
                </p>
              </div>
              <Link
                href="/result"
                className="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-full text-sm transition-all duration-200"
              >
                ← Back to audit history
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Loading (brief localStorage read) ──
  if (!result) return null;

  const isBigSaver = result.totalMonthlySaving >= 500;
  const isOptimised = result.totalMonthlySaving < 100;
  const enabledCount = result.recommendations.length;

  return (
    <div className="min-h-screen font-sans antialiased bg-[#fafaf8]">
      <NavBar />

      <main className="pt-28 pb-24 px-4">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* ── Back + Share bar ── */}
          <div className="flex items-center justify-between">
            <Link
              href="/result"
              id="back-to-history"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              <FaArrowLeft className="text-xs" />
              All audits
            </Link>
            <button
              id="share-result-btn"
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#20714b] transition-colors"
            >
              <FaShare className="text-xs" />
              {copied ? "Link copied!" : "Share result"}
            </button>
          </div>

          {/* ── Page title ── */}
          <div>
            <span className="inline-flex items-center gap-2 bg-[#20714b]/10 border border-[#20714b]/30 rounded-full px-4 py-1.5 text-sm font-medium text-[#20714b] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#20714b]" />
              Audit complete
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
              {result.formState.companyName
                ? `${result.formState.companyName}'s`
                : "Your"}{" "}
              AI spend audit
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {enabledCount} tool{enabledCount !== 1 ? "s" : ""} audited ·{" "}
              {new Date(result.auditedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* ── Hero savings ── */}
          <HeroSavings
            totalMonthlySpend={result.totalMonthlySpend}
            totalMonthlySaving={result.totalMonthlySaving}
            totalAnnualSaving={result.totalAnnualSaving}
          />

          {/* ── AI Summary ── */}
          <AiSummaryCard summary={result.aiSummary} />

          {/* ── Per-tool breakdown ── */}
          <section>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-widest mb-4">
              Per-tool breakdown
            </h2>
            <div className="flex flex-col gap-4">
              {result.recommendations.map((rec, i) => (
                <ToolRecommendationCard key={rec.toolId} rec={rec} index={i} />
              ))}
            </div>
          </section>

          {/* ── Honest message if already optimised ── */}
          {isOptimised && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-5 text-center">
              <p className="text-green-800 font-bold text-base mb-1 flex items-center justify-center gap-2">
                <FaCheckCircle /> You&apos;re spending well.
              </p>
              <p className="text-green-700 text-sm">
                We didn&apos;t find meaningful waste in your stack. Come back as your team
                grows — that&apos;s when overspend tends to creep in.
              </p>
            </div>
          )}

          {/* ── Lead capture ── */}
          <LeadCaptureSection
            showCredex={isBigSaver}
            companyName={result.formState.companyName}
          />

          {/* ── Bottom actions ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/result"
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium"
            >
              ← All audits
            </Link>
            <span className="hidden sm:block text-gray-200">·</span>
            <Link
              href="/audit"
              className="text-sm text-gray-400 hover:text-[#20714b] transition-colors font-medium"
            >
              Run a new audit →
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
