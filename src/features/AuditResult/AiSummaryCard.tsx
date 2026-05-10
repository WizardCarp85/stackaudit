"use client";
import { FaMagic } from "react-icons/fa";

interface Props {
  summary: string;
  isLoading?: boolean;
}

export default function AiSummaryCard({ summary, isLoading = false }: Props) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#fc742b] via-orange-400 to-yellow-400" />

      <div className="px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          {/* Anthropic-style spark icon */}
          <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-sm text-orange-500">
            <FaMagic />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 leading-none">AI Summary</p>
            <p className="text-[11px] text-gray-400">Powered by Claude (Anthropic)</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[100, 90, 75].map((w, i) => (
              <div
                key={i}
                className="h-3 bg-gray-100 rounded-full animate-pulse"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
        )}
      </div>
    </div>
  );
}
