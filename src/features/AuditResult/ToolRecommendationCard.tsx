"use client";

import type { ToolRecommendation } from "@/lib/types";
import { TOOLS_MAP } from "@/lib/tools-config";
import { FaArrowRight, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface Props {
  rec: ToolRecommendation;
  index: number;
}

export default function ToolRecommendationCard({ rec, index }: Props) {
  const config = TOOLS_MAP[rec.toolId];
  const hasSaving = rec.potentialSaving > 0;

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden group hover:shadow-lg ${
        hasSaving
          ? "border-orange-200 hover:border-[#fc742b]/40"
          : "border-gray-200 hover:border-gray-300"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: config?.color ?? "#fc742b" }}
      />

      <div className="pl-6 pr-5 py-5">
        {/* Tool header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
              style={{ background: config?.color ?? "#fc742b" }}
            />
            <div>
              <h3 className="text-sm font-bold text-gray-900">{config?.name ?? rec.toolId}</h3>
              <p className="text-xs text-gray-400">
                ${rec.currentSpend.toLocaleString()}/mo current spend
              </p>
            </div>
          </div>

          {hasSaving ? (
            <div className="flex-shrink-0 text-right">
              <p className="text-[#fc742b] font-extrabold text-base leading-none">
                −${rec.potentialSaving.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">/ month</p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
              <FaCheckCircle className="text-green-500 text-xs" />
              <span className="text-xs font-semibold text-green-700">Optimised</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* Recommended action */}
        <div className="flex items-start gap-3">
          {hasSaving ? (
            <FaExclamationTriangle className="text-[#fc742b] text-sm mt-0.5 flex-shrink-0" />
          ) : (
            <FaCheckCircle className="text-green-500 text-sm mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Recommendation
            </p>
            <p className="text-sm font-semibold text-gray-800">{rec.recommendedAction}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{rec.reason}</p>
          </div>
        </div>

        {hasSaving && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Annual saving potential</span>
            <span className="text-sm font-bold text-gray-900">
              ${(rec.potentialSaving * 12).toLocaleString()}/yr
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
