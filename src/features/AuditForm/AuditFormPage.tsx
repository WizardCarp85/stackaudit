"use client";

import { useRouter } from "next/navigation";
import { FaArrowRight, FaUndo } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "./ToolCard";
import { useAuditForm } from "@/hooks/useAuditForm";
import { TOOLS_CONFIG } from "@/lib/tools-config";
import { runAudit } from "@/lib/audit-engine";
import { saveAuditToHistory } from "@/lib/audit-history";

export default function AuditFormPage() {
  const router = useRouter();
  const { form, enabledTools, setTopLevel, setToolField, toggleTool, resetForm } =
    useAuditForm();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = runAudit(form);
    saveAuditToHistory(result);
    router.push(`/result/${result.id}`);
  }

  const totalMonthly = enabledTools.reduce((sum, t) => {
    const spend = parseFloat(form.tools[t.id]?.monthlySpend || "0");
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
              Toggle the tools your team uses, fill in your current spend, and we&apos;ll
              find where you&apos;re overpaying.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ── Section 1: Tools ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">
                  Your tools
                </h2>
                {enabledTools.length > 0 && (
                  <span className="text-xs text-gray-400">
                    {enabledTools.length} selected
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {TOOLS_CONFIG.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    config={tool}
                    entry={form.tools[tool.id]}
                    onToggle={toggleTool}
                    onField={setToolField}
                  />
                ))}
              </div>
            </section>

            {/* ── Section 2: Team context ── */}
            <section>
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-4">
                Team context
              </h2>
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Team size */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="team-size"
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
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
                    className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/20 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#20714b]/30 focus:border-[#20714b] transition-all"
                  />
                </div>

                {/* Company name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="company-name"
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Company name{" "}
                    <span className="text-gray-300 normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    placeholder="Acme Inc."
                    value={form.companyName}
                    onChange={(e) => setTopLevel("companyName", e.target.value)}
                    className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/20 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#20714b]/30 focus:border-[#20714b] transition-all"
                  />
                </div>

                {/* Email — full width */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Email{" "}
                    <span className="text-gray-300 normal-case font-normal">
                      (we&apos;ll send you the report)
                    </span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@acme.com"
                    value={form.email}
                    onChange={(e) => setTopLevel("email", e.target.value)}
                    className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/20 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#20714b]/30 focus:border-[#20714b] transition-all"
                  />
                </div>
              </div>
            </section>

            {/* ── Live spend ticker ── */}
            {totalMonthly > 0 && (
              <div className="bg-gray-950 dark:bg-white/10 border border-transparent dark:border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  Declared monthly spend
                </span>
                <span className="text-white font-extrabold text-xl">
                  ${totalMonthly.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  <span className="text-gray-500 font-normal text-sm">/mo</span>
                </span>
              </div>
            )}

            {/* ── Actions ── */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="submit"
                id="run-audit-btn"
                disabled={enabledTools.length === 0}
                className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 bg-[#20714b] hover:bg-[#185e3e] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#20714b]/20 hover:scale-105 active:scale-95 text-base"
              >
                Run my audit
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button
                type="button"
                id="reset-form-btn"
                onClick={resetForm}
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors duration-200"
              >
                <FaUndo className="text-xs" />
                Reset form
              </button>
            </div>

            {enabledTools.length === 0 && (
              <p className="text-center text-xs text-gray-400">
                Toggle at least one tool above to run your audit.
              </p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
