"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuditHistory } from "@/hooks/useAuditHistory";
import { TOOLS_MAP } from "@/lib/tools-config";
import type { AuditResult } from "@/lib/types";
import { FaTrash, FaArrowRight, FaPlus, FaClipboardList } from "react-icons/fa";

function AuditCard({
  audit,
  onDelete,
}: {
  audit: AuditResult;
  onDelete: (id: string) => void;
}) {
  const toolNames = audit.recommendations
    .map((r) => TOOLS_MAP[r.toolId]?.name ?? r.toolId)
    .join(", ");

  const hasSavings = audit.totalMonthlySaving > 0;
  const date = new Date(audit.auditedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl hover:border-[#20714b]/40 hover:shadow-lg hover:shadow-[#20714b]/5 transition-all duration-300 overflow-hidden">
      {/* Saving accent strip */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-colors duration-300 ${hasSavings ? "bg-[#20714b]" : "bg-green-400"
          }`}
      />

      <div className="pl-6 pr-5 py-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: meta */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-gray-900 truncate">
                {audit.formState.companyName
                  ? `${audit.formState.companyName}'s audit`
                  : "Unnamed audit"}
              </h2>
            </div>
            <p className="text-xs text-gray-400 mb-3">{date}</p>
            <p className="text-xs text-gray-500 truncate max-w-xs">
              {audit.recommendations.length} tool
              {audit.recommendations.length !== 1 ? "s" : ""} — {toolNames}
            </p>
          </div>

          {/* Right: saving pill */}
          <div className="flex-shrink-0 text-right">
            {hasSavings ? (
              <>
                <p className="text-[#20714b] font-extrabold text-lg leading-none">
                  −${audit.totalMonthlySaving.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">/mo potential</p>
              </>
            ) : (
              <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                Optimised
              </span>
            )}
          </div>
        </div>

        {/* Footer row */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            ${audit.totalMonthlySpend.toLocaleString()}/mo spend ·{" "}
            ${audit.totalAnnualSaving.toLocaleString()}/yr saving
          </span>
          <div className="flex items-center gap-3">
            {/* Delete */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(audit.id);
              }}
              aria-label="Delete audit"
              className="text-gray-300 hover:text-red-400 transition-colors duration-200"
            >
              <FaTrash className="text-xs" />
            </button>
            {/* View */}
            <Link
              href={`/result/${audit.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#20714b] hover:text-[#185e3e] transition-colors group/link"
            >
              View
              <FaArrowRight className="text-[10px] group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuditHistoryPage() {
  const { history, hydrated, deleteAudit } = useAuditHistory();

  return (
    <div className="min-h-screen font-sans antialiased bg-[#fafaf8]">
      <Navbar />

      <main className="pt-28 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-2 bg-[#20714b]/10 border border-[#20714b]/30 rounded-full px-4 py-1.5 text-sm font-medium text-[#20714b] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#20714b] animate-pulse" />
                Audit history
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
                Your{" "}
                <span className="text-[#20714b]">past audits</span>
              </h1>
              {hydrated && history.length > 0 && (
                <p className="text-gray-400 text-sm mt-2">
                  {history.length} audit{history.length !== 1 ? "s" : ""} saved
                </p>
              )}
            </div>
            <Link
              href="/audit"
              id="new-audit-btn"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#20714b] hover:bg-[#185e3e] text-white font-bold px-5 py-3 rounded-full text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#20714b]/20"
            >
              <FaPlus className="text-xs" />
              New audit
            </Link>
          </div>

          {/* List or empty state */}
          {!hydrated ? (
            // Skeleton while reading localStorage
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl h-32 animate-pulse"
                />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl px-8 py-20 flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#20714b]/10 border border-[#20714b]/20 flex items-center justify-center text-3xl text-[#20714b]">
                <FaClipboardList />
              </div>
              <div>
                <p className="text-gray-900 font-bold text-xl mb-2">No audits yet</p>
                <p className="text-gray-400 text-sm max-w-sm">
                  Run your first audit and it will appear here. Takes under 3 minutes.
                </p>
              </div>
              <Link
                href="/audit"
                id="empty-history-cta"
                className="inline-flex items-center gap-2.5 bg-[#20714b] hover:bg-[#185e3e] text-white font-bold px-8 py-4 rounded-full text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#20714b]/20"
              >
                Start my free audit →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {history.map((audit) => (
                <AuditCard key={audit.id} audit={audit} onDelete={deleteAudit} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
