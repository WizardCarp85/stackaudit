"use client";

interface Props {
  totalMonthlySpend: number;
  totalMonthlySaving: number;
  totalAnnualSaving: number;
}

export default function HeroSavings({
  totalMonthlySpend,
  totalMonthlySaving,
  totalAnnualSaving,
}: Props) {
  const savingsPercent =
    totalMonthlySpend > 0
      ? Math.round((totalMonthlySaving / totalMonthlySpend) * 100)
      : 0;

  const isOptimised = totalMonthlySaving < 100;
  const isBig = totalMonthlySaving >= 500;

  return (
    <div className="relative bg-gray-950 dark:bg-black dark:border dark:border-white/10 rounded-3xl overflow-hidden px-8 py-10 md:px-14 md:py-14">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #20714b 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#20714b]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Label */}
        <p className="text-[#20714b] text-xs font-bold uppercase tracking-[0.18em] mb-6">
          {isOptimised ? "Your stack looks good" : "Potential savings found"}
        </p>

        <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          {/* Monthly */}
          <div>
            <p className="text-gray-500 text-sm mb-1">Monthly savings</p>
            <p className="text-white font-extrabold text-5xl md:text-6xl tracking-tight leading-none">
              ${totalMonthlySaving.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              <span className="text-2xl text-gray-500 font-semibold ml-1">/mo</span>
            </p>
          </div>

          {/* Annual */}
          <div>
            <p className="text-gray-500 text-sm mb-1">Annual savings</p>
            <p className="text-[#20714b] font-extrabold text-4xl md:text-5xl tracking-tight leading-none">
              ${totalAnnualSaving.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              <span className="text-xl text-gray-500 font-semibold ml-1">/yr</span>
            </p>
          </div>

          {/* Stats pill */}
          {!isOptimised && (
            <div className="md:ml-auto flex flex-col items-start md:items-end gap-3">
              <div className="bg-white/5 dark:bg-white/10 border border-white/10 dark:border-white/20 rounded-2xl px-5 py-3">
                <p className="text-gray-400 text-xs mb-1">vs. current spend</p>
                <p className="text-white font-bold text-2xl">{savingsPercent}%</p>
              </div>
              <p className="text-gray-600 dark:text-gray-500 text-xs">
                Current: ${totalMonthlySpend.toLocaleString()}/mo
              </p>
            </div>
          )}
        </div>

        {isBig && (
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 bg-[#20714b]/10 border border-[#20714b]/30 rounded-full px-4 py-2 hover:bg-[#20714b]/20 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#20714b] animate-pulse" />
            <span className="text-[#20714b] text-xs font-semibold">
              Credex can help you capture even more of this saving →
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
