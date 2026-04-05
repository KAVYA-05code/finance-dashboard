import { useApp } from "../context/AppContext";
import { MONTHLY_DATA, CAT_COLORS, CATEGORY_ICONS } from "../data/Data";

const fmt = n => "₹" + Math.abs(n).toLocaleString("en-IN");

export default function Insights() {
  const { transactions, darkMode: dark, totalIncome, totalExpense, balance } = useApp();

  const expenses  = transactions.filter(t => t.type === "expense");
  const catTotals = {};
  expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
  const sortedCats = Object.entries(catTotals).sort((a,b) => b[1] - a[1]);
  const topCat     = sortedCats[0];

  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
  const avgDaily    = totalExpense > 0 ? Math.round(totalExpense / 30) : 0;

  const kpis = [
    { label:"Savings Rate",    value:`${savingsRate}%`,             icon:"🎯", gradient:"from-violet-500 to-purple-600",  hint: savingsRate > 50 ? "Excellent!" : "Room to improve" },
    { label:"Top Expense",     value: topCat ? topCat[0] : "N/A",  icon:"🏆", gradient:"from-amber-500 to-orange-500",   hint: topCat ? fmt(topCat[1]) : "No data" },
    { label:"Avg Daily Spend", value: fmt(avgDaily),                icon:"📅", gradient:"from-sky-500 to-blue-600",       hint:"Based on 30 days" },
    { label:"Net Flow",        value: balance >= 0 ? "Positive" : "Negative", icon: balance >= 0 ? "✅" : "⚠️",
      gradient: balance >= 0 ? "from-teal-500 to-emerald-500" : "from-rose-500 to-pink-600",
      hint: fmt(Math.abs(balance)) },
  ];

  const card = `rounded-2xl p-5 relative overflow-hidden card-hover ${
    dark ? "bg-slate-800/70 border border-slate-700/50" : "bg-white border border-slate-100 shadow-sm"
  }`;

  return (
    <div className="flex flex-col gap-6">

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={k.label} className={`${card} animate-slide-up delay-${(i+1)*100}`}>
            <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br ${k.gradient} opacity-10`} />
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.gradient} flex items-center justify-center text-xl mb-3 shadow-lg`}>
              {k.icon}
            </div>
            <p className={`text-xs uppercase tracking-widest mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{k.label}</p>
            <p className={`text-xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{k.value}</p>
            <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{k.hint}</p>
          </div>
        ))}
      </div>

      {/* Monthly comparison table */}
      <div className={`rounded-2xl p-5 ${dark ? "bg-slate-800/70 border border-slate-700/50" : "bg-white border border-slate-100 shadow-sm"}`}>
        <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>Monthly Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={dark ? "text-slate-500" : "text-slate-400"}>
                {["Month","Income","Expenses","Savings","Rate"].map(h => (
                  <th key={h} className="text-left pb-3 pr-4 text-xs uppercase tracking-wider font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MONTHLY_DATA.map(m => {
                const sav  = m.income - m.expenses;
                const rate = Math.round((sav / m.income) * 100);
                return (
                  <tr key={m.month} className={`border-t ${dark ? "border-slate-700/50" : "border-slate-100"}`}>
                    <td className={`py-3 pr-4 font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{m.month}</td>
                    <td className="py-3 pr-4 text-teal-400 font-mono">{fmt(m.income)}</td>
                    <td className="py-3 pr-4 text-rose-400 font-mono">{fmt(m.expenses)}</td>
                    <td className={`py-3 pr-4 font-mono ${sav >= 0 ? "text-teal-400" : "text-rose-400"}`}>{fmt(sav)}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-20 rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-100"}`}>
                          <div className="h-full rounded-full bg-teal-500"
                            style={{ width:`${Math.max(0,rate)}%`, transition:"width 1s ease" }} />
                        </div>
                        <span className={`text-xs font-mono ${dark ? "text-slate-400" : "text-slate-500"}`}>{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category deep-dive */}
      <div className={`rounded-2xl p-5 ${dark ? "bg-slate-800/70 border border-slate-700/50" : "bg-white border border-slate-100 shadow-sm"}`}>
        <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>Category Breakdown</h3>
        <div className="flex flex-col gap-3">
          {sortedCats.map(([cat, amt], i) => {
            const pct = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`flex items-center gap-2 text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>
                    <span>{CATEGORY_ICONS[cat] || "💸"}</span>
                    <span>{cat}</span>
                  </span>
                  <span className={`text-sm font-mono font-semibold ${dark ? "text-white" : "text-slate-800"}`}>
                    {fmt(amt)} <span className={`text-xs font-normal ${dark ? "text-slate-500" : "text-slate-400"}`}>({pct}%)</span>
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-100"}`}>
                  <div className="h-full rounded-full"
                    style={{ width:`${pct}%`, background: CAT_COLORS[cat] || "#94a3b8", transition:`width 1s ease ${i*80}ms` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}