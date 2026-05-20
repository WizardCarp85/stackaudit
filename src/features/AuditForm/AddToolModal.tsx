"use client";

import { useEffect, useRef, useState } from "react";
import { FaTimes, FaPlus, FaCheck } from "react-icons/fa";
import { TOOLS_CONFIG } from "@/lib/tools-config";
import type { ToolId } from "@/lib/types";

interface Props {
  onAdd: (toolId: ToolId) => void;
  onClose: () => void;
}

export default function AddToolModal({ onAdd, onClose }: Props) {
  const [selected, setSelected] = useState<ToolId | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleConfirm() {
    if (!selected) return;
    onAdd(selected);
    onClose();
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  const selectedConfig = selected ? TOOLS_CONFIG.find((t) => t.id === selected) : null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#111] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
        style={{ animation: "modalIn 0.18s cubic-bezier(.4,0,.2,1)" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/10">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">
              Add a tool
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Choose the AI tool you want to audit
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <FaTimes />
          </button>
        </div>

        {/* ── Tool grid ── */}
        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Select model
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {TOOLS_CONFIG.map((tool) => {
              const isSelected = selected === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setSelected(tool.id)}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all duration-150 ${
                    isSelected
                      ? "border-[#20714b] bg-[#20714b]/8 shadow-sm shadow-[#20714b]/20"
                      : "border-gray-150 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10"
                  }`}
                >
                  {/* Color bar */}
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: tool.color }}
                  />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold leading-tight truncate ${isSelected ? "text-[#20714b] dark:text-[#4ade80]" : "text-gray-800 dark:text-white"}`}>
                      {tool.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{tool.vendor}</p>
                  </div>
                  {isSelected && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#20714b] dark:text-[#4ade80]">
                      <FaCheck className="text-xs" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Selected preview / footer ── */}
        <div className="px-6 pb-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {selectedConfig ? (
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: selectedConfig.color }}
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                  {selectedConfig.name}
                </span>
                <span className="text-xs text-gray-400">selected</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">No tool selected</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selected}
            className="inline-flex items-center gap-2 bg-[#20714b] hover:bg-[#185e3e] disabled:opacity-40 disabled:hover:bg-[#20714b] disabled:hover:scale-100 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-[0_0_16px_0_#20714b40] hover:shadow-[0_0_24px_0_#20714b66] disabled:shadow-none hover:scale-105 active:scale-95 text-sm flex-shrink-0"
          >
            <FaPlus className="text-xs" />
            Add tool
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}
