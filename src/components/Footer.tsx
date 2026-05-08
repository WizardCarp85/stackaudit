import Image from "next/image";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand & Credex */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/stackauditlogo.png" alt="StackAudit logo" width={32} height={32} className="rounded-md opacity-90" />
              <span className="text-gray-200 font-bold text-lg tracking-tight">
                Stack<span className="text-[#fc742b]">Audit</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A free tool to help startups uncover AI overspend and find better alternatives.
            </p>
            <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-2 text-xs text-gray-400">
              <span>Powered by</span>
              <a href="https://credex.ai" target="_blank" rel="noopener noreferrer" className="text-[#fc742b] font-semibold hover:text-orange-400 transition-colors flex items-center gap-1">
                Credex
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-12 sm:gap-24">
            <div>
              <h4 className="text-gray-100 font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#audit" className="hover:text-white transition-colors">Free Audit</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-100 font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="https://credex.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">About Credex</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800/80 gap-4">
          <p className="text-gray-600 text-xs">© 2026 StackAudit. All rights reserved.</p>
          <div className="flex items-center gap-5 text-gray-500">
            <a href="#" className="hover:text-[#fc742b] transition-colors" aria-label="Twitter">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-[#fc742b] transition-colors" aria-label="GitHub">
              <FaGithub className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-[#fc742b] transition-colors" aria-label="LinkedIn">
              <FaLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
