"use client";

import { useState } from "react";
import type { ToolRecommendation } from "@/lib/types";
import { TOOLS_MAP } from "@/lib/tools-config";
import {
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface Props {
  oldRecs: ToolRecommendation[];
  newRecs: ToolRecommendation[];
}

type ChangeStatus = "improved" | "worse" | "unchanged" | "new" | "removed";

interface DiffRow {
  toolId: string;
  toolName: string;
  toolColor: string;
  status: ChangeStatus;
  oldSaving: number;
  newSaving: number;
  oldSpend: number;
  newSpend: number;
  delta: number;
  oldAction: string;
  newAction: string;
}

function buildDiffRows(oldRecs: ToolRecommendation[], newRecs: ToolRecommendation[]): DiffRow[] {
  const allToolIds = new Set([
    ...oldRecs.map((r) => r.toolId),
    ...newRecs.map((r) => r.toolId),
  ]);

  const rows: DiffRow[] = [];

  for (const toolId of allToolIds) {
    const oldRec = oldRecs.find((r) => r.toolId === toolId);
    const newRec = newRecs.find((r) => r.toolId === toolId);
    const config = TOOLS_MAP[toolId];

    const oldSaving = oldRec?.potentialSaving ?? 0;
    const newSaving = newRec?.potentialSaving ?? 0;
    const delta = newSaving - oldSaving;

    let status: ChangeStatus;
    if (!oldRec) status = "new";
    else if (!newRec) status = "removed";
    else if (delta > 0) status = "improved";
    else if (delta < 0) status = "worse";
    else status = "unchanged";

    rows.push({
      toolId,
      toolName: config?.name ?? toolId,
      toolColor: config?.color ?? "#20714b",
      status,
      oldSaving,
      newSaving,
      oldSpend: oldRec?.currentSpend ?? 0,
      newSpend: newRec?.currentSpend ?? 0,
      delta,
      oldAction: oldRec?.recommendedAction ?? "—",
      newAction: newRec?.recommendedAction ?? "Tool removed from stack",
    });
  }

  // Sort: changed first, unchanged last
  const order: ChangeStatus[] = ["improved", "worse", "new", "removed", "unchanged"];
  rows.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));

  return rows;
}

const STATUS_CONFIG: Record<
  ChangeStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  improved: {
    label: "Improved",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
    icon: <FaArrowUp className="text-[10px]" />,
  },
  worse: {
    label: "Worse",
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-900/50",
    icon: <FaArrowDown className="text-[10px]" />,
  },
  new: {
    label: "New tool",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900/50",
    icon: <FaArrowUp className="text-[10px]" />,
  },
  removed: {
    label: "Removed",
    bg: "bg-gray-50 dark:bg-white/5",
    text: "text-gray-500 dark:text-gray-400",
    border: "border-gray-200 dark:border-white/10",
    icon: <FaMinus className="text-[10px]" />,
  },
  unchanged: {
    label: "Unchanged",
    bg: "bg-gray-50 dark:bg-white/5",
    text: "text-gray-400 dark:text-gray-500",
    border: "border-gray-100 dark:border-white/10",
    icon: <FaMinus className="text-[10px]" />,
  },
};

function DiffRow({ row }: { row: DiffRow }) {
  const sc = STATUS_CONFIG[row.status];
  const hasChange = row.status !== "unchanged";

  return (
    <div
      className={`relative rounded-2xl border ${sc.bg} ${sc.border} overflow-hidden transition-opacity duration-200 ${
        !hasChange ? "opacity-50" : ""
      }`}
    >
      {/* Tool color accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: row.toolColor }}
      />

      <div className="pl-6 pr-5 py-4">
        {/* Header row: Tool Name + Status Badge + Savings Delta */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: row.toolColor }}
            />
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {row.toolName}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${sc.text} border ${sc.border}`}
              >
                {sc.icon}
                {sc.label}
              </span>
            </div>
          </div>
          
          <div className="flex-shrink-0 text-right">
             {row.delta !== 0 && hasChange && row.status !== "removed" && (
                <p
                  className={`text-base font-extrabold leading-none ${
                    row.delta > 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {row.delta > 0 ? "+" : ""}
                  {row.delta > 0 ? "−" : "+"}${Math.abs(row.delta).toLocaleString()}/mo
                </p>
              )}
          </div>
        </div>

        {/* Side-by-side Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Column: Original Audit */}
          <div className={`p-3 rounded-xl border ${hasChange ? 'bg-white/50 dark:bg-black/20 border-gray-200 dark:border-white/10' : 'border-transparent'}`}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Original Audit</p>
            {row.status === "new" ? (
               <p className="text-xs text-gray-400 italic">Tool was not in stack</p>
            ) : (
              <>
                <p className={`text-xs ${row.status === "removed" ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  {row.oldAction}
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-500">
                    Spend: <span className={row.status === "removed" ? 'line-through' : 'font-semibold'}>${row.oldSpend.toLocaleString()}/mo</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Saving: <span className={row.status === "removed" ? 'line-through' : 'font-semibold'}>${row.oldSaving.toLocaleString()}/mo</span>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Right Column: New Audit */}
          <div className={`p-3 rounded-xl border ${hasChange ? 'bg-white/50 dark:bg-black/20 border-gray-200 dark:border-white/10' : 'border-transparent'}`}>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">New Audit</p>
             {row.status === "removed" ? (
               <p className="text-xs text-gray-400 italic">Tool removed from stack</p>
             ) : (
               <>
                 <p className="text-xs font-medium text-gray-800 dark:text-gray-100">
                  {row.newAction}
                 </p>
                 <div className="mt-3 space-y-1">
                   <p className="text-xs text-gray-600 dark:text-gray-400">
                    Spend: <span className="font-bold text-gray-800 dark:text-white">${row.newSpend.toLocaleString()}/mo</span>
                   </p>
                   <p className="text-xs text-gray-600 dark:text-gray-400">
                    Saving: <span className="font-bold text-[#20714b]">${row.newSaving.toLocaleString()}/mo</span>
                   </p>
                 </div>
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DiffView({ oldRecs, newRecs }: Props) {
  const [showUnchanged, setShowUnchanged] = useState(false);

  const rows = buildDiffRows(oldRecs, newRecs);
  const changedRows = rows.filter((r) => r.status !== "unchanged");
  const unchangedRows = rows.filter((r) => r.status === "unchanged");

  const oldTotal = oldRecs.reduce((s, r) => s + r.potentialSaving, 0);
  const newTotal = newRecs.reduce((s, r) => s + r.potentialSaving, 0);
  const totalDelta = newTotal - oldTotal;

  return (
    <div className="rounded-3xl border border-[#20714b]/20 bg-gradient-to-br from-[#20714b]/5 to-transparent overflow-hidden">
      {/* ── Headline delta ── */}
      <div className="px-6 pt-6 pb-5 border-b border-[#20714b]/10">
        <p className="text-xs font-bold text-[#20714b] uppercase tracking-widest mb-2">
          What changed since your last audit
        </p>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="text-gray-400 text-sm">
            <span className="line-through">${oldTotal.toLocaleString()}/mo</span>
          </div>
          <div className="text-gray-400 text-sm">→</div>
          <div className="text-gray-900 dark:text-white font-bold text-lg">
            ${newTotal.toLocaleString()}/mo
          </div>
          {totalDelta !== 0 && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full ${
                totalDelta > 0
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
              }`}
            >
              {totalDelta > 0 ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
              {totalDelta > 0 ? "Extra " : ""}
              {totalDelta > 0 ? "−" : "+"}${Math.abs(totalDelta).toLocaleString()}/mo{" "}
              {totalDelta > 0 ? "unlocked" : "lost"}
            </span>
          )}
        </div>
      </div>

      {/* ── Diff rows ── */}
      <div className="px-6 py-5 space-y-3">
        {changedRows.map((row) => (
          <DiffRow key={row.toolId} row={row} />
        ))}

        {unchangedRows.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowUnchanged((v) => !v)}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors font-medium pt-1"
            >
              {showUnchanged ? (
                <FaChevronUp className="text-[10px]" />
              ) : (
                <FaChevronDown className="text-[10px]" />
              )}
              {showUnchanged ? "Hide" : "Show"} {unchangedRows.length} unchanged tool
              {unchangedRows.length !== 1 ? "s" : ""}
            </button>

            {showUnchanged &&
              unchangedRows.map((row) => <DiffRow key={row.toolId} row={row} />)}
          </>
        )}
      </div>
    </div>
  );
}
