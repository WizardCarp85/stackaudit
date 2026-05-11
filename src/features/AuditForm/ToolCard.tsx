"use client";

import type { ToolConfig } from "@/lib/tools-config";
import type { ToolEntry, ToolId } from "@/lib/types";

interface Props {
  config: ToolConfig;
  entry: ToolEntry;
  onToggle: (id: ToolId) => void;
  onField: <K extends keyof ToolEntry>(id: ToolId, key: K, val: ToolEntry[K]) => void;
}

const USE_CASES = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "data", label: "Data" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed" },
] as const;

export default function ToolCard({ config, entry, onToggle, onField }: Props) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        entry.enabled
          ? "border-[#20714b]/40 bg-[#20714b]/5 shadow-md shadow-[#20714b]/10"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {/* ── Header row ── */}
      <button
        type="button"
        id={`tool-toggle-${config.id}`}
        onClick={() => onToggle(config.id)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group"
        aria-expanded={entry.enabled}
      >
        <div className="flex items-center gap-3">
          {/* Color dot */}
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: config.color }}
          />
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{config.name}</p>
            <p className="text-xs text-gray-400">{config.vendor}</p>
          </div>
        </div>

        {/* Toggle pill */}
        <div
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
            entry.enabled ? "bg-[#20714b]" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
              entry.enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </div>
      </button>

      {/* ── Expanded fields ── */}
      {entry.enabled && (
        <div className="px-5 pt-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 border-t border-[#20714b]/15">
          {/* Plan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Plan
            </label>
            <select
              id={`tool-plan-${config.id}`}
              value={entry.plan}
              onChange={(e) => onField(config.id, "plan", e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#20714b]/30 focus:border-[#20714b] transition-all"
            >
              {config.plans.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Monthly spend */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Monthly Spend (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                $
              </span>
              <input
                id={`tool-spend-${config.id}`}
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={entry.monthlySpend}
                onChange={(e) => onField(config.id, "monthlySpend", e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#20714b]/30 focus:border-[#20714b] transition-all"
              />
            </div>
          </div>

          {/* Seats */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Number of Seats
            </label>
            <input
              id={`tool-seats-${config.id}`}
              type="number"
              min="1"
              step="1"
              placeholder="1"
              value={entry.seats}
              onChange={(e) => onField(config.id, "seats", e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#20714b]/30 focus:border-[#20714b] transition-all"
            />
          </div>

          {/* Use case */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Primary Use Case
            </label>
            <select
              id={`tool-usecase-${config.id}`}
              value={entry.useCase}
              onChange={(e) =>
                onField(config.id, "useCase", e.target.value as ToolEntry["useCase"])
              }
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#20714b]/30 focus:border-[#20714b] transition-all"
            >
              <option value="">Select use case…</option>
              {USE_CASES.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
