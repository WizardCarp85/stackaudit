"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSavings from "./HeroSavings";
import ToolRecommendationCard from "./ToolRecommendationCard";
import AiSummaryCard from "./AiSummaryCard";
import LeadCaptureSection from "./LeadCaptureSection";
import DiffView from "./DiffView";
import { getAuditById, saveAuditToHistory } from "@/lib/audit-history";
import type { AuditResult, ToolRecommendation } from "@/lib/types";
import { FaArrowLeft, FaShare, FaSearch, FaCheckCircle, FaRedo, FaEdit } from "react-icons/fa";

interface Props {
  /** The audit ID from the URL — e.g. /result/[id] */
  id: string;
}

export default function AuditResultPage({ id }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [oldRecs, setOldRecs] = useState<ToolRecommendation[] | null>(null);
  const summaryFetched = useRef(false);
  const savedToCloud = useRef(false);

  useEffect(() => {
    // 1. Try local storage first for instant load
    const localAudit = getAuditById(id);
    if (localAudit) {
      setResult(localAudit);
      if ((localAudit as AuditResult & { aiSummarySource?: string }).aiSummarySource !== "ai") {
        setSummaryLoading(true);
      }
    } else {
      setSummaryLoading(true); // Need to wait for DB fetch
    }

    // 2. Fetch from DB to sync state (especially pricingOutdated)
    fetch(`/api/audits?id=${id}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((dbAudit) => {
        if (!dbAudit) {
          if (!localAudit) {
            setNotFound(true);
            setSummaryLoading(false);
          } else {
            // Not in DB yet (first time viewing), so save it to cloud
            fetch("/api/audits", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(localAudit),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.id) setShareId(data.id);
              })
              .catch(console.error);
          }
          return;
        }
        
        setShareId(dbAudit.id);
        setResult(dbAudit);
        saveAuditToHistory(dbAudit); // Sync local storage with DB state
        if ((dbAudit as AuditResult & { aiSummarySource?: string }).aiSummarySource !== "ai") {
          setSummaryLoading(true);
        } else {
          setSummaryLoading(false);
        }
        setNotFound(false);
      })
      .catch((err) => {
        console.error("[AuditResultPage] Failed to fetch from DB:", err);
        if (!localAudit) {
          setNotFound(true);
          setSummaryLoading(false);
        }
      });
  }, [id]);

  // Load old recommendations for diff view
  useEffect(() => {
    const compare = searchParams.get("compare");
    const diffWith = searchParams.get("diffWith");

    if (compare === "true") {
      // "Update existing" path — read snapshot we saved before overwriting
      try {
        const raw = localStorage.getItem(`stackaudit_diff_prev_${id}`);
        if (raw) {
          setOldRecs(JSON.parse(raw));
          // Note: Deliberately not clearing this key here so it persists on reload.
          // It will get overwritten the next time they update this specific audit.
        }
      } catch { /* ignore */ }
    } else if (diffWith) {
      // "Create new" path — load the original audit from history
      const original = getAuditById(diffWith);
      if (original) setOldRecs(original.recommendations);
    }
  }, [id, searchParams]);

  // Fetch AI-generated summary asynchronously after audit loads
  useEffect(() => {
    if (!result || summaryFetched.current) return;
    summaryFetched.current = true;

    // Check if this audit already has an AI-generated summary cached
    // (aiSummarySource is set when we successfully get an AI summary)
    if ((result as AuditResult & { aiSummarySource?: string }).aiSummarySource === "ai") {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSummaryLoading(true);

    fetch("/api/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then((data: { summary: string; source: "ai" | "template" }) => {
        if (data.summary) {
          setResult((prev) => {
            if (!prev) return prev;
            const updated = {
              ...prev,
              aiSummary: data.summary,
              aiSummarySource: data.source, // 'ai' or 'template'
            };
            
            // Only persist to history if it's a real AI summary
            // This allows users to "retry" by refreshing if their key was broken
            if (data.source === "ai") {
              saveAuditToHistory(updated);
            }
            return updated;
          });
        }
      })
      .catch((err) => {
        console.error("[AuditResultPage] AI summary fetch failed:", err);
        // Keep the templated fallback already in result.aiSummary
      })
      .finally(() => {
        setSummaryLoading(false);
      });
  }, [result]);

  // The cloud saving logic is now handled in the first useEffect to avoid race conditions.

  function handleShare() {
    const baseUrl = window.location.origin;
    const shareUrl = shareId 
      ? `${baseUrl}/share/${shareId}` 
      : window.location.href;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleRerun() {
    if (!result) return;
    // Write old form state into the form's localStorage key so it pre-fills on mount
    try {
      const stateToSave = { ...result.formState, originalAuditId: result.id };
      localStorage.setItem("stackaudit_form_v2", JSON.stringify(stateToSave));
    } catch {
      // ignore storage errors
    }
    router.push("/audit");
  }

  // ── Not found state ──
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col font-sans antialiased bg-[#fafaf8] dark:bg-black">
        <Navbar />
        <main className="flex-1 pt-28 pb-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-white/5 border-2 border-dashed border-gray-200 dark:border-white/20 rounded-3xl px-8 py-20 flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-3xl text-gray-400">
                <FaSearch />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white font-bold text-xl mb-2">Audit not found</p>
                <p className="text-gray-400 text-sm max-w-sm">
                  This audit doesn&apos;t exist or may have been deleted.
                </p>
              </div>
              <Link
                href="/result"
                className="inline-flex items-center gap-2 bg-gray-950 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold px-8 py-4 rounded-full text-sm transition-all duration-200"
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
    <div className="min-h-screen flex flex-col font-sans antialiased bg-[#fafaf8] dark:bg-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4">
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
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#20714b] dark:hover:text-[#20714b] transition-colors"
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
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-tight">
              {result.formState.auditName ? (
                result.formState.auditName
              ) : (
                <>
                  {result.formState.companyName
                    ? `${result.formState.companyName}'s`
                    : "Your"}{" "}
                  AI spend audit
                </>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              {enabledCount} tool{enabledCount !== 1 ? "s" : ""} audited ·{" "}
              {new Date(result.auditedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            {/* ── Outdated Pricing Banner ── */}
            {result.pricingOutdated && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl px-6 py-4 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-amber-800 dark:text-amber-400 font-bold text-sm mb-1">
                    ⚠️ Pricing data has changed
                  </p>
                  <p className="text-amber-700 dark:text-amber-500 text-sm">
                    One or more tools in this stack have updated their prices or plans since this audit was run.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRerun}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md flex-shrink-0"
                >
                  <FaRedo className="text-xs" />
                  Re-run Audit
                </button>
              </div>
            )}
          </div>

          {/* ── Diff view (shown when coming from a re-run/edit) ── */}
          {oldRecs && result.recommendations.length > 0 && (
            <DiffView oldRecs={oldRecs} newRecs={result.recommendations} />
          )}

          {/* ── Hero savings ── */}
          <HeroSavings
            totalMonthlySpend={result.totalMonthlySpend}
            totalMonthlySaving={result.totalMonthlySaving}
            totalAnnualSaving={result.totalAnnualSaving}
          />

          {/* ── AI Summary ── */}
          <AiSummaryCard summary={result.aiSummary} isLoading={summaryLoading} />

          {/* ── Per-tool breakdown ── */}
          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4">
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
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-2xl px-6 py-5 text-center">
              <p className="text-green-800 dark:text-green-400 font-bold text-base mb-1 flex items-center justify-center gap-2">
                <FaCheckCircle /> You&apos;re spending well.
              </p>
              <p className="text-green-700 dark:text-green-500 text-sm">
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
            <button
              type="button"
              onClick={handleRerun}
              className="text-sm text-gray-400 hover:text-[#20714b] transition-colors font-medium inline-flex items-center gap-1.5"
            >
              <FaEdit className="text-xs" />
              Edit this stack
            </button>
            <span className="hidden sm:block text-gray-200">·</span>
            <Link
              href="/audit"
              className="text-sm text-gray-400 hover:text-[#20714b] transition-colors font-medium"
            >
              Start new audit →
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
