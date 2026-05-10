"use client";

import { useState } from "react";
import { FaArrowRight, FaBell } from "react-icons/fa";

interface Props {
  /** true = big savings found → show Credex CTA. false = low savings → show "notify me" */
  showCredex: boolean;
  companyName?: string;
}

export default function LeadCaptureSection({ showCredex, companyName }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to /api/leads  (Supabase / Firebase / Resend)
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-8 text-center">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <FaBell className="text-green-600" />
        </div>
        <p className="text-green-800 font-bold text-base">You&apos;re on the list!</p>
        <p className="text-green-700 text-sm mt-1">
          We&apos;ll reach out when new optimisations apply to your stack.
        </p>
      </div>
    );
  }

  if (showCredex) {
    return (
      <div className="relative bg-gray-950 rounded-2xl overflow-hidden px-6 py-8 md:px-10">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, #fc742b 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative">
          <span className="text-[#fc742b] text-xs font-bold uppercase tracking-widest">
            Capture more savings
          </span>
          <h3 className="text-white font-extrabold text-2xl mt-2 mb-2 leading-tight">
            Get discounted AI credits <br className="hidden md:block" />
            through Credex.
          </h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md">
            Companies that overforecast sell their credits at a discount. Credex
            connects you to those deals — instantly, on top of your audit savings.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              id="credex-email"
              type="email"
              required
              placeholder={companyName ? `you@${companyName.toLowerCase().replace(/\s+/g, "")}.com` : "you@company.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc742b]/50 focus:border-[#fc742b] transition-all"
            />
            <button
              id="credex-cta-btn"
              type="submit"
              className="group inline-flex items-center gap-2 bg-[#fc742b] hover:bg-[#e5601a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Connect me
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Low savings / already optimised → "notify me" variant
  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
          <FaBell className="text-[#fc742b] text-sm" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Stay in the loop</p>
          <p className="text-xs text-gray-400">
            You&apos;re spending well. We&apos;ll notify you when new optimisations apply.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          id="notify-email"
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc742b]/30 focus:border-[#fc742b] transition-all"
        />
        <button
          id="notify-btn"
          type="submit"
          className="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200"
        >
          Notify me
        </button>
      </form>
    </div>
  );
}
