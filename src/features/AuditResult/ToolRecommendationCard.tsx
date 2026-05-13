"use client";

import type { ToolRecommendation } from "@/lib/types";
import { TOOLS_MAP } from "@/lib/tools-config";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface Props {
  rec: ToolRecommendation;
  index: number;
}

export default function ToolRecommendationCard({ rec, index }: Props) {
  const config = TOOLS_MAP[rec.toolId];
  const hasSaving = rec.potentialSaving > 0;

  return (
    <div
      className={`relative bg-white dark:bg-white/5 rounded-2xl border transition-all duration-300 overflow-hidden group hover:shadow-lg ${
        hasSaving
          ? "border-[#20714b]/20 hover:border-[#20714b]/40"
          : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: config?.color ?? "#20714b" }}
      />

      <div className="pl-6 pr-5 py-5">
        {/* Tool header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
              style={{ background: config?.color ?? "#20714b" }}
            />
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{config?.name ?? rec.toolId}</h3>
              <p className="text-xs text-gray-400">
                ${rec.currentSpend.toLocaleString()}/mo current spend
              </p>
            </div>
          </div>

          {hasSaving ? (
            <div className="flex-shrink-0 text-right">
              <p className="text-[#20714b] font-extrabold text-base leading-none">
                −${rec.potentialSaving.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">/ month</p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-full px-3 py-1">
              <FaCheckCircle className="text-green-500 text-xs" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">Optimised</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 dark:bg-white/10 mb-4" />

        {/* Recommended action */}
        <div className="flex items-start gap-3">
          {hasSaving ? (
            <FaExclamationTriangle className="text-[#20714b] text-sm mt-0.5 flex-shrink-0" />
          ) : (
            <FaCheckCircle className="text-green-500 text-sm mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Recommendation
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{rec.recommendedAction}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{rec.reason}</p>
          </div>
        </div>

        {hasSaving && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-400">Annual saving potential</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              ${(rec.potentialSaving * 12).toLocaleString()}/yr
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
