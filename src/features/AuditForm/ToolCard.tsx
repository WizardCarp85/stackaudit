"use client";

import type { ToolConfig } from "@/lib/tools-config";
import type { ToolEntry } from "@/lib/types";
import {
  FaTrashAlt,
  FaCreditCard,
  FaDollarSign,
  FaUsers,
  FaBriefcase,
  FaChevronDown,
} from "react-icons/fa";

interface Props {
  config: ToolConfig;
  entry: ToolEntry;
  onRemove: (instanceId: string) => void;
  onField: <K extends keyof ToolEntry>(instanceId: string, key: K, val: ToolEntry[K]) => void;
}

const USE_CASES = [
  { value: "coding",   label: "Coding" },
  { value: "writing",  label: "Writing" },
  { value: "data",     label: "Data" },
  { value: "research", label: "Research" },
  { value: "mixed",    label: "Mixed" },
] as const;

function FieldLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
      <span className="text-[10px]">{icon}</span>
      {children}
    </label>
  );
}

export default function ToolCard({ config, entry, onRemove, onField }: Props) {
  const inputBase =
    "w-full bg-white/80 dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.18] rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#20714b]/40 focus:border-[#20714b] dark:focus:border-[#4ade80] transition-all duration-150 hover:border-gray-300 dark:hover:border-white/30";
  const selectBase = inputBase + " appearance-none cursor-pointer";

  return (
    <div className="rounded-2xl border border-[#20714b]/30 dark:border-[#20714b]/40 bg-gradient-to-b from-[#20714b]/[0.06] to-transparent dark:from-[#20714b]/[0.12] dark:to-[#20714b]/[0.03] shadow-sm overflow-hidden transition-all duration-300">

      {/* ── Header strip ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#20714b]/10">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: config.color, boxShadow: `0 0 0 2px ${config.color}44` }}
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">{config.name}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-0.5 leading-none">{config.vendor}</p>
          </div>
          {/* Active plan chip */}
          {entry.plan && (
            <span
              className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap"
              style={{
                background: config.color + "18",
                color: config.color,
                borderColor: config.color + "40",
              }}
            >
              {config.plans.find((p) => p.value === entry.plan)?.label ?? entry.plan}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(entry.instanceId)}
          className="ml-4 flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150"
          title="Remove tool"
        >
          <FaTrashAlt className="text-[11px]" />
        </button>
      </div>

      {/* ── Fields grid ── */}
      <div className="px-5 pt-5 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">

        {/* Plan */}
        <div>
          <FieldLabel icon={<FaCreditCard />}>Plan</FieldLabel>
          <div className="relative">
            <select
              id={`tool-plan-${entry.instanceId}`}
              value={entry.plan}
              onChange={(e) => onField(entry.instanceId, "plan", e.target.value)}
              className={selectBase + " pl-3 pr-8 py-2.5 [&>option]:dark:bg-gray-900"}
            >
              {config.plans.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 text-[10px] pointer-events-none" />
          </div>
        </div>

        {/* Monthly spend */}
        <div>
          <FieldLabel icon={<FaDollarSign />}>Monthly spend</FieldLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-semibold pointer-events-none">
              $
            </span>
            <input
              id={`tool-spend-${entry.instanceId}`}
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={entry.monthlySpend}
              onChange={(e) => onField(entry.instanceId, "monthlySpend", e.target.value)}
              className={inputBase + " pl-7 pr-3 py-2.5"}
            />
          </div>
        </div>

        {/* Seats */}
        <div>
          <FieldLabel icon={<FaUsers />}>Number of seats</FieldLabel>
          <input
            id={`tool-seats-${entry.instanceId}`}
            type="number"
            min="1"
            step="1"
            placeholder="1"
            value={entry.seats}
            onChange={(e) => onField(entry.instanceId, "seats", e.target.value)}
            className={inputBase + " px-3 py-2.5"}
          />
        </div>

        {/* Use case */}
        <div>
          <FieldLabel icon={<FaBriefcase />}>Primary use case</FieldLabel>
          <div className="relative">
            <select
              id={`tool-usecase-${entry.instanceId}`}
              value={entry.useCase}
              onChange={(e) => onField(entry.instanceId, "useCase", e.target.value as ToolEntry["useCase"])}
              className={selectBase + " pl-3 pr-8 py-2.5 [&>option]:dark:bg-gray-900"}
            >
              <option value="">Select use case...</option>
              {USE_CASES.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 text-[10px] pointer-events-none" />
          </div>
        </div>

      </div>
    </div>
  );
}
