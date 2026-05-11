"use client";

import Image from "next/image";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  FaKeyboard, FaRobot, FaCommentDots, FaGithub, FaPalette, FaFileAlt,
  FaPlug, FaChartBar, FaMoneyBillWave,
  FaSearch, FaBolt, FaChartLine, FaLock, FaFileInvoiceDollar, FaHandshake,
  FaQuestionCircle, FaEyeSlash, FaArrowRight, FaCode, FaStar
} from "react-icons/fa";

const TOOLS = [
  { name: "Cursor", icon: <FaKeyboard /> },
  { name: "GitHub Copilot", icon: <FaGithub /> },
  { name: "Claude", icon: <FaRobot /> },
  { name: "ChatGPT", icon: <FaCommentDots /> },
  { name: "Anthropic API", icon: <FaRobot /> },
  { name: "OpenAI API", icon: <FaCommentDots /> },
  { name: "Gemini", icon: <FaStar /> },
  { name: "v0", icon: <FaCode /> },
];

const STEPS = [
  {
    num: "01",
    title: "Connect your stack",
    desc: "Paste your AI tool invoices or connect billing accounts. Takes under 2 minutes.",
    icon: <FaPlug />,
  },
  {
    num: "02",
    title: "Get your audit",
    desc: "We benchmark your spend against real usage data from similar-stage startups.",
    icon: <FaChartBar />,
  },
  {
    num: "03",
    title: "Cut the waste",
    desc: "Get a clear report on overspend, cheaper alternatives, and exactly what to cut.",
    icon: <FaMoneyBillWave />,
  },
];

const FEATURES = [
  {
    icon: <FaSearch />,
    title: "Instant benchmarking",
    desc: "See how your AI spend compares to startups at your exact stage and headcount.",
  },
  {
    icon: <FaBolt />,
    title: "Smarter alternatives",
    desc: "We surface cheaper tools matched to your actual usage — not generic swap lists.",
  },
  {
    icon: <FaChartLine />,
    title: "Waste detection",
    desc: "Uncover idle licenses, duplicate capabilities, and plans you've already outgrown.",
  },
  {
    icon: <FaLock />,
    title: "Zero data stored",
    desc: "Your billing data is processed in-session only. We never touch your financials.",
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: "One-click report",
    desc: "Export a clean PDF for your CFO or board — no spreadsheet wrangling required.",
  },
  {
    icon: <FaHandshake />,
    title: "Credex deals",
    desc: "Access discounted AI credits from companies that overforecast. Real savings, instantly.",
  },
];

const PROBLEMS = [
  {
    icon: <FaQuestionCircle />,
    title: "No benchmark exists",
    desc: "You have no idea if your $8K/month AI spend is normal for a 12-person team — or 3× too high.",
  },
  {
    icon: <FaEyeSlash />,
    title: "Cheaper options stay hidden",
    desc: "Vendors won't tell you. You don't have time to research. The overspend just keeps compounding.",
  },
  {
    icon: <FaFileInvoiceDollar />,
    title: "No second opinion",
    desc: "There's no advisor, no dashboard, no nudge. Just the invoice — every single month.",
  },
];



function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-28 overflow-hidden bg-[#fafaf8]">
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(circle, #d0ddd8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#fafaf8]/80 via-transparent to-[#fafaf8]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#fafaf8]/80 via-transparent to-[#fafaf8]/80 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-[#20714b]/10 border border-[#20714b]/30 rounded-full px-4 py-1.5 text-sm font-medium text-[#20714b] mb-14">
          <span className="w-1.5 h-1.5 rounded-full bg-[#20714b] animate-pulse" />
          Free audit — no credit card required
        </div>

        <h1 className="text-5xl md:text-[4.5rem] font-extrabold text-gray-950 leading-[1.06] tracking-[-0.02em] mb-8">
          Your AI tools are costing<br />
          <span className="relative inline-block text-[#20714b]">
            more than they should.
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 580 10" fill="none">
              <path d="M2 8 Q145 2 290 7 Q435 12 578 3" stroke="#20714b" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.35" />
            </svg>
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-3 font-light leading-relaxed">
          Most startups overspend on Cursor, Claude, ChatGPT, and Copilot — and have no idea.
        </p>
        <p className="text-xl md:text-2xl text-gray-800 font-semibold max-w-2xl mx-auto mb-12">
          StackAudit is the{" "}
          <span className="text-[#20714b]">&ldquo;Mint for AI spend.&rdquo;</span>
        </p>

        <div id="audit" className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="/audit"
            className="group bg-gray-950 hover:bg-[#20714b] text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#20714b]/20 hover:scale-105 active:scale-95 flex items-center gap-2.5"
          >
            Audit my stack — it&apos;s free
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a href="#how-it-works" className="text-gray-500 hover:text-gray-900 font-medium text-base transition-colors duration-200">
            See how it works ↓
          </a>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Audits tools including</p>
          <div className="flex flex-wrap justify-center gap-2">
            {TOOLS.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-sm text-gray-600 font-medium hover:border-[#20714b]/40 hover:bg-[#20714b]/5 hover:text-[#20714b] transition-all duration-200 shadow-sm"
              >
                <span className="text-xs">{t.icon}</span>
                {t.name}
              </div>
            ))}
            <div className="flex items-center bg-white border border-dashed border-gray-200 rounded-full px-3.5 py-1.5 text-sm text-gray-400 font-medium">
              + many more
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="bg-gray-950 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#20714b] font-semibold text-xs uppercase tracking-[0.15em]">The problem</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 leading-tight tracking-tight">
            You look at the bill.<br />You sigh. You pay it.
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto font-light">
            Every month. No context. No alternatives. No audit trail.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PROBLEMS.map((card) => (
            <div
              key={card.title}
              className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-[#20714b]/40 hover:bg-white/[0.07] transition-all duration-300 group"
            >
              <div className="text-[#20714b] text-3xl mb-5 opacity-80 group-hover:opacity-100 transition-opacity">{card.icon}</div>
              <h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#20714b] font-semibold text-xs uppercase tracking-[0.15em]">How it works</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-950 mt-4 tracking-tight">
            Three steps.{" "}
            <span className="text-[#20714b]">Under five minutes.</span>
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-10">
          <div className="hidden md:block absolute top-7 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px bg-gradient-to-r from-[#20714b]/10 via-[#20714b]/40 to-[#20714b]/10 z-0" />

          {STEPS.map((step, i) => (
            <div key={step.num} className="flex flex-col items-center text-center group relative z-10">
              <div className="relative mb-7">
                <div className="w-14 h-14 bg-[#20714b]/10 border-2 border-[#20714b]/30 group-hover:bg-[#20714b] group-hover:border-[#20714b] rounded-full flex items-center justify-center text-xl text-[#20714b] group-hover:text-white transition-all duration-300 relative z-10">
                  {step.icon}
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gray-950 text-white text-[11px] font-bold rounded-full flex items-center justify-center z-20 border-2 border-white">
                  {i + 1}
                </span>
              </div>
              <div className="text-xs font-bold text-gray-300 tracking-widest mb-2 uppercase">{step.num}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-[#fafaf8] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#20714b] font-semibold text-xs uppercase tracking-[0.15em]">Features</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-950 mt-4 tracking-tight">
            Built to stop the bleed.
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto font-light">
            Everything you need to understand, benchmark, and reduce your AI spend.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-7 border border-gray-200 transition-all duration-300 group cursor-default hover:shadow-lg hover:shadow-[#20714b]/5 hover:border-[#20714b]/30"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5 transition-all duration-300 group-hover:scale-110 bg-[#20714b]/10 text-[#20714b] group-hover:bg-[#20714b] group-hover:text-white">
                {f.icon}
              </div>
              <h3 className="text-[15px] font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-gray-950 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #20714b 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#20714b]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <span className="text-[#20714b] font-semibold text-xs uppercase tracking-[0.15em]">Get started free</span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-5 leading-tight tracking-tight">
          Know what you&apos;re actually<br />spending on AI.
        </h2>
        <p className="text-gray-400 text-lg mb-10 font-light">
          Free. No credit card. Results in under 3 minutes.
        </p>
        <a
          href="/audit"
          className="inline-flex items-center gap-2.5 bg-[#20714b] hover:bg-[#185e3e] text-white font-bold px-10 py-4 rounded-full text-base transition-all duration-200 shadow-xl shadow-[#20714b]/30 hover:scale-105 active:scale-95"
        >
          Start my free audit
          <FaArrowRight className="text-sm" />
        </a>
      </div>
    </section>
  );
}



export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans antialiased">
      <NavBar />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}