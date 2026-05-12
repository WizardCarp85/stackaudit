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
      <div className="h-1 w-full bg-gradient-to-r from-[#20714b] via-[#2a9463] to-[#3ab57a]" />

      <div className="px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          {/* Gemini-style spark icon */}
          <div className="w-7 h-7 rounded-lg bg-[#20714b]/10 border border-[#20714b]/20 flex items-center justify-center text-sm text-[#20714b]">
            <FaMagic />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 leading-none">AI Summary</p>
            <p className="text-[11px] text-gray-400">Powered by Gemini (Google)</p>
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
