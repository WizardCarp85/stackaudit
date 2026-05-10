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
    <div className="relative bg-gray-950 rounded-3xl overflow-hidden px-8 py-10 md:px-14 md:py-14">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #fc742b 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#fc742b]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Label */}
        <p className="text-[#fc742b] text-xs font-bold uppercase tracking-[0.18em] mb-6">
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
            <p className="text-[#fc742b] font-extrabold text-4xl md:text-5xl tracking-tight leading-none">
              ${totalAnnualSaving.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              <span className="text-xl text-gray-500 font-semibold ml-1">/yr</span>
            </p>
          </div>

          {/* Stats pill */}
          {!isOptimised && (
            <div className="md:ml-auto flex flex-col items-start md:items-end gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
                <p className="text-gray-400 text-xs mb-1">vs. current spend</p>
                <p className="text-white font-bold text-2xl">{savingsPercent}%</p>
              </div>
              <p className="text-gray-600 text-xs">
                Current: ${totalMonthlySpend.toLocaleString()}/mo
              </p>
            </div>
          )}
        </div>

        {isBig && (
          <div className="mt-8 inline-flex items-center gap-2 bg-[#fc742b]/10 border border-[#fc742b]/30 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fc742b] animate-pulse" />
            <span className="text-[#fc742b] text-xs font-semibold">
              Credex can help you capture even more of this saving →
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
