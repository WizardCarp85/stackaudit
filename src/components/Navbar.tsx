"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 md:pt-3 px-4 pointer-events-none mt-2">
      <div
        className={`pointer-events-auto flex items-center justify-between w-full max-w-5xl px-5 py-3 rounded-full transition-all duration-500 border ${
          scrolled
            ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border-[#20714b]/30"
            : "bg-white/20 dark:bg-white/5 backdrop-blur-lg border-[#20714b]/20"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 group">
          <div className="relative overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-105">
            <Image src="/stackaudit.png" alt="StackAudit logo" width={34} height={34}/>
          </div>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Stack<span className="text-[#20714b]">Audit</span>
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-50/50 dark:bg-white/5 px-2 py-1.5 rounded-full border border-gray-100 dark:border-white/10">
          {(pathname === "/"
            ? [["How it works", "#how-it-works"], ["Features", "#features"]]
            : [["Audit", "/audit"], ["Results", "/result"]]
          ).map(([label, href]) => {
            const isActive = href.startsWith("/") && pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 shadow-sm ${
                  isActive
                    ? "text-[#20714b] bg-[#20714b]/10 border-[#20714b]/20 shadow-[0_2px_10px_rgba(32,113,75,0.08)]"
                    : "text-gray-600 dark:text-gray-300 border-transparent shadow-transparent hover:text-[#20714b] hover:bg-[#20714b]/5 hover:border-[#20714b]/15 hover:shadow-[0_2px_10px_rgba(32,113,75,0.08)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {pathname === "/" ? (
            <Link
              href="/audit"
              className="group relative overflow-hidden bg-[#20714b] hover:bg-[#185e3e] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(32,113,75,0.4)] hover:-translate-y-px active:translate-y-px active:scale-95 flex items-center gap-1.5"
            >
              <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] transition-transform duration-700 ease-out pointer-events-none" />
              <span className="relative z-10">Free audit</span>
              <span className="relative z-10 transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
            </Link>
          ) : (
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-[#20714b] hover:bg-[#185e3e] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-[0_0_20_rgba(32,113,75,0.4)] hover:-translate-y-px active:translate-y-px active:scale-95 flex items-center gap-1.5"
            >
              <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] transition-transform duration-700 ease-out pointer-events-none" />
              <span className="relative z-10">Credex Deals</span>
              <span className="relative z-10 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}