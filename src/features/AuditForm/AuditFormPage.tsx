"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowRight, FaUndo, FaPlus, FaLayerGroup,
  FaUsers, FaBuilding, FaEnvelope, FaChartBar, FaTag,
} from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "./ToolCard";
import AddToolModal from "./AddToolModal";
import UpdateModeModal from "./UpdateModeModal";
import { useAuditForm } from "@/hooks/useAuditForm";
import { TOOLS_MAP } from "@/lib/tools-config";
import { runAudit } from "@/lib/audit-engine";
import { saveAuditToHistory, getAuditById } from "@/lib/audit-history";
import type { ToolId } from "@/lib/types";

export default function AuditFormPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { form, setTopLevel, setToolField, addTool, removeTool, resetForm } =
    useAuditForm();

  function handleAddTool(toolId: ToolId) {
    addTool(toolId);
  }

  function executeAudit(overrideId?: string) {
    // Snapshot old recommendations BEFORE we overwrite, so the result page can show a diff
    let diffParam = "";
    if (overrideId) {
      // "Update existing" path — save old recs under a temp localStorage key
      try {
        const oldAudit = getAuditById(overrideId);
        if (oldAudit) {
          localStorage.setItem(
            `stackaudit_diff_prev_${overrideId}`,
            JSON.stringify(oldAudit.recommendations)
          );
        }
      } catch { /* ignore storage errors */ }
      diffParam = "?compare=true";
    } else if (form.originalAuditId) {
      // "Create new" path — point the result page at the original for comparison
      diffParam = `?diffWith=${form.originalAuditId}`;
    }

    const result = runAudit(form, overrideId);
    
    // If this came from an update flow, flag it for the UI
    if (overrideId || form.originalAuditId) {
      result.isUpdated = true;
    }

    saveAuditToHistory(result);
    // Clear the form so a subsequent visit to /audit is fresh
    resetForm();
    router.push(`/result/${result.id}${diffParam}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.originalAuditId) {
      setShowUpdateModal(true);
    } else {
      executeAudit();
    }
  }

  const totalMonthly = form.tools.reduce((sum, entry) => {
    const spend = parseFloat(entry.monthlySpend || "0");
    return sum + (isNaN(spend) ? 0 : spend);
  }, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-[#fafaf8] dark:bg-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          {/* ── Page header ── */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-[#20714b]/10 border border-[#20714b]/30 rounded-full px-4 py-1.5 text-sm font-medium text-[#20714b] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#20714b] animate-pulse" />
              Free AI spend audit
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-tight mb-4">
              What&apos;s in your{" "}
              <span className="text-[#20714b]">AI stack?</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-light max-w-xl mx-auto">
              Add the tools your team uses, fill in your current spend, and we&apos;ll
              find where you&apos;re overpaying.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── Section 1: Tools ── */}
            <section>
              {/* Header row with Add Tool button */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">
                    Your tools
                  </h2>
                  {form.tools.length > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#20714b] text-white text-[10px] font-bold">
                      {form.tools.length}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {form.tools.length > 0 && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <FaUndo className="text-xs" />
                      Clear all
                    </button>
                  )}
                  <button
                    type="button"
                    id="add-tool-btn"
                    onClick={() => setShowModal(true)}
                    className="group inline-flex items-center gap-2 bg-[#20714b] hover:bg-[#185e3e] text-white font-semibold text-sm px-4 py-2 rounded-full transition-all duration-200 shadow-[0_0_16px_0_#20714b40] hover:shadow-[0_0_24px_0_#20714b66] hover:scale-105 active:scale-95"
                  >
                    <FaPlus className="text-xs group-hover:rotate-90 transition-transform duration-200" />
                    Add tool
                  </button>
                </div>
              </div>

              {/* Tool cards */}
              {form.tools.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {form.tools.map((entry) => (
                    <ToolCard
                      key={entry.instanceId}
                      config={TOOLS_MAP[entry.toolId]}
                      entry={entry}
                      onRemove={removeTool}
                      onField={setToolField}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="w-full group flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#20714b]/30 dark:border-[#20714b]/40 rounded-2xl py-12 bg-[#20714b]/[0.03] dark:bg-[#20714b]/[0.07] hover:border-[#20714b]/60 dark:hover:border-[#20714b]/70 hover:bg-[#20714b]/[0.07] dark:hover:bg-[#20714b]/[0.13] shadow-[0_0_0_0_#20714b00] hover:shadow-[0_0_24px_0_#20714b22] dark:hover:shadow-[0_0_32px_0_#20714b33] transition-all duration-200 cursor-pointer"
                >
                  <span className="w-12 h-12 rounded-2xl bg-[#20714b]/10 dark:bg-[#20714b]/20 flex items-center justify-center text-[#20714b]/60 dark:text-[#4ade80]/60 group-hover:bg-[#20714b]/20 dark:group-hover:bg-[#20714b]/30 group-hover:text-[#20714b] dark:group-hover:text-[#4ade80] transition-all duration-200">
                    <FaLayerGroup className="text-xl" />
                  </span>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#20714b]/70 dark:text-[#4ade80]/70 group-hover:text-[#20714b] dark:group-hover:text-[#4ade80] transition-colors">
                      No tools added yet
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Click to add your first AI tool
                    </p>
                  </div>
                </button>
              )}
            </section>

            {/* ── Section 2: Team context ── */}
            <section>
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4">
                Team context
              </h2>
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.14] bg-white dark:bg-white/[0.05] overflow-hidden">

                {/* Row 1: team size + company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-white/[0.1]">

                  {/* Team size */}
                  <div className="p-5">
                    <label
                      htmlFor="team-size"
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
                    >
                      <FaUsers className="text-[10px]" />
                      Total team size
                    </label>
                    <input
                      id="team-size"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="e.g. 12"
                      value={form.teamSize}
                      onChange={(e) => setTopLevel("teamSize", e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                    />
                  </div>

                  {/* Company name */}
                  <div className="p-5">
                    <label
                      htmlFor="company-name"
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
                    >
                      <FaBuilding className="text-[10px]" />
                      Company name
                      <span className="normal-case font-normal text-gray-300 dark:text-gray-500">(optional)</span>
                    </label>
                    <input
                      id="company-name"
                      type="text"
                      placeholder="Acme Inc."
                      value={form.companyName}
                      onChange={(e) => setTopLevel("companyName", e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-white/[0.1]" />

                {/* Row 2: audit name + email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-white/[0.1]">
                  {/* Audit Name */}
                  <div className="p-5">
                    <label
                      htmlFor="audit-name"
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
                    >
                      <FaTag className="text-[10px]" />
                      Audit Name
                      <span className="normal-case font-normal text-gray-300 dark:text-gray-500">(optional)</span>
                    </label>
                    <input
                      id="audit-name"
                      type="text"
                      placeholder="e.g. Q3 Cost Analysis"
                      value={form.auditName || ""}
                      onChange={(e) => setTopLevel("auditName", e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="p-5">
                    <label
                      htmlFor="email"
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
                    >
                      <FaEnvelope className="text-[10px]" />
                      Email
                      <span className="normal-case font-normal text-gray-300 dark:text-gray-500">(optional)</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@acme.com"
                      value={form.email}
                      onChange={(e) => setTopLevel("email", e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-[#20714b]/80 dark:text-[#4ade80]/80 mt-2 font-medium">
                      * Add an email to receive automatic alerts when your tools change pricing.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* ── Live spend ticker ── */}
            {totalMonthly > 0 && (
              <div className="rounded-2xl bg-gradient-to-r from-gray-950 to-gray-900 dark:from-white/10 dark:to-white/5 border border-gray-800 dark:border-white/10 px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-gray-400">
                  <FaChartBar className="text-sm flex-shrink-0" />
                  <span className="text-sm">Declared monthly spend</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-extrabold text-2xl tabular-nums">
                    ${totalMonthly.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/mo</span>
                </div>
              </div>
            )}

            {/* ── Actions ── */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="submit"
                id="run-audit-btn"
                disabled={form.tools.length === 0}
                className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 bg-[#20714b] hover:bg-[#185e3e] disabled:opacity-40 disabled:hover:bg-[#20714b] disabled:hover:scale-100 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-full transition-all duration-200 shadow-[0_0_16px_0_#20714b40] hover:shadow-[0_0_24px_0_#20714b66] disabled:shadow-none hover:scale-105 active:scale-95 text-base"
              >
                Run my audit
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button
                type="button"
                id="reset-form-btn"
                onClick={resetForm}
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <FaUndo className="text-xs" />
                Reset form
              </button>
            </div>
          </form>

          {/* ── Add Tool Modal ── */}
          {showModal && (
            <AddToolModal
              onAdd={handleAddTool}
              onClose={() => setShowModal(false)}
            />
          )}

          {/* ── Update Mode Modal ── */}
          {showUpdateModal && (
            <UpdateModeModal
              onClose={() => setShowUpdateModal(false)}
              onSelect={(mode) => {
                setShowUpdateModal(false);
                if (mode === "update") {
                  executeAudit(form.originalAuditId);
                } else {
                  executeAudit();
                }
              }}
            />
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
