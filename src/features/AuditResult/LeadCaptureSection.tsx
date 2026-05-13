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
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Simple honeypot check
    if (honeypot) return;

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          companyName,
          role,
          teamSize,
          metadata: {
            source: showCredex ? "credex_cta" : "notify_me",
            url: window.location.href
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save lead");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("[LeadCapture] Error:", err);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-2xl px-6 py-8 text-center">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-3">
          <FaBell className="text-green-600 dark:text-green-400" />
        </div>
        <p className="text-green-800 dark:text-green-400 font-bold text-base">You&apos;re on the list!</p>
        <p className="text-green-700 dark:text-green-500 text-sm mt-1">
          We&apos;ll reach out when new optimisations apply to your stack.
        </p>
      </div>
    );
  }

  return (
    <div className={showCredex 
      ? "relative bg-black dark:border dark:border-white/10 rounded-2xl overflow-hidden px-6 py-8 md:px-10"
      : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-8"
    }>
      {showCredex && (
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, #20714b 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      )}
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${showCredex ? "bg-[#20714b]/20 border border-[#20714b]/30" : "bg-[#20714b]/10 border border-[#20714b]/20"}`}>
            <FaBell className="text-[#20714b] text-sm" />
          </div>
          <div>
            <p className={`text-sm font-bold ${showCredex ? "text-white" : "text-gray-900 dark:text-white"}`}>
              {showCredex ? "Get discounted AI credits" : "Stay in the loop"}
            </p>
            <p className="text-xs text-gray-400">
              {showCredex ? "Capture even more savings through Credex." : "We'll notify you when new optimisations apply."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field (hidden from humans) */}
          <input
            type="text"
            name="b_phone"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className={`text-xs font-bold uppercase tracking-wider ${showCredex ? "text-gray-500" : "text-gray-400"}`}>Email Address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
                  showCredex 
                    ? "bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:ring-[#20714b]/50 focus:border-[#20714b]"
                    : "bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-[#20714b]/30 focus:border-[#20714b]"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="role" className={`text-xs font-bold uppercase tracking-wider ${showCredex ? "text-gray-500" : "text-gray-400"}`}>Your Role</label>
              <input
                id="role"
                type="text"
                placeholder="e.g. CTO, Founder"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
                  showCredex 
                    ? "bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:ring-[#20714b]/50 focus:border-[#20714b]"
                    : "bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-[#20714b]/30 focus:border-[#20714b]"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="teamSize" className={`text-xs font-bold uppercase tracking-wider ${showCredex ? "text-gray-500" : "text-gray-400"}`}>Team Size</label>
              <select
                id="teamSize"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
                  showCredex 
                    ? "bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:ring-[#20714b]/50 focus:border-[#20714b]"
                    : "bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-[#20714b]/30 focus:border-[#20714b]"
                } [&>option]:dark:bg-gray-900`}
              >
                <option value="" disabled className="text-gray-900 dark:text-white">Select size...</option>
                <option value="1-5" className="text-gray-900 dark:text-white">1-5 people</option>
                <option value="6-20" className="text-gray-900 dark:text-white">6-20 people</option>
                <option value="21-50" className="text-gray-900 dark:text-white">21-50 people</option>
                <option value="50+" className="text-gray-900 dark:text-white">50+ people</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className={`w-full inline-flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 ${
                  showCredex
                    ? "bg-[#20714b] hover:bg-[#185e3e] text-white hover:scale-[1.02] active:scale-95"
                    : "bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900"
                }`}
              >
                {showCredex ? "Connect me" : "Notify me"}
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
