"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 md:pt-3 px-4 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl px-5 py-3 rounded-full transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/40 shadow-[#fc742b]/5"
            : "bg-transparent border border-transparent"
        }`}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Image src="/auditlogo.png" alt="StackAudit logo" width={34} height={34}/>
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            Stack<span className="text-[#fc742b]">Audit</span>
          </span>
        </a>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50/50 px-2 py-1.5 rounded-full border border-gray-100/50">
          {[["How it works", "#how-it-works"], ["Features", "#features"]].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm font-semibold text-gray-600 hover:text-[#fc742b] hover:bg-orange-50 border border-transparent hover:border-orange-100 px-4 py-1.5 rounded-full transition-all duration-200 shadow-sm shadow-transparent hover:shadow-[0_2px_10px_rgba(252,116,43,0.08)]"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#audit"
          className="group relative overflow-hidden bg-[#fc742b] hover:bg-[#e86520] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(252,116,43,0.4)] hover:-translate-y-px active:translate-y-px active:scale-95 flex items-center gap-1.5"
        >
          <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] transition-transform duration-700 ease-out pointer-events-none" />
          <span className="relative z-10">Free audit</span>
          <span className="relative z-10 transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
        </a>
      </div>
    </header>
  );
}
