import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { MONTHLY_DATA, CAT_COLORS, CATEGORY_ICONS } from "../data/Data";

const fmt     = n => "₹" + Math.abs(n).toLocaleString("en-IN");
const fmtDate = d => new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });

/* ── Animated counter ───────────────────────────────────────────────── */
function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef();
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return <span>₹{Math.abs(display).toLocaleString("en-IN")}</span>;
}

/* ── Summary Card ───────────────────────────────────────────────────── */
function SummaryCard({ title, value, icon, gradient, sub, delay = "" }) {
  const { darkMode: dark } = useApp();
  return (
    <div className={`card-hover animate-slide-up ${delay} rounded-2xl p-5 relative overflow-hidden ${
      dark ? "bg-slate-800/70 border border-slate-700/50" : "bg-white border border-slate-100 shadow-sm"
    }`}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10`} />
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} text-white text-lg mb-3 shadow-lg`}>
        {icon}
      </div>
      <p className={`text-xs font-medium uppercase tracking-widest mb-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>{title}</p>
      <p className={`text-2xl font-bold font-mono ${dark ? "text-white" : "text-slate-900"}`}>
        <AnimatedNumber value={value} />
      </p>
      {sub && <p className={`text-xs mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{sub}</p>}
    </div>
  );
}

/* ── Bar Chart ──────────────────────────────────────────────────────── */
function BarChart() {
  const { darkMode: dark } = useApp();
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);
  const max = Math.max(...MONTHLY_DATA.map(m => Math.max(m.income, m.expenses)));

  return (
    <div className={`rounded-2xl p-5 ${dark ? "bg-slate-800/70 border border-slate-700/50" : "bg-white border border-slate-100 shadow-sm"}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Income vs Expenses</h3>
          <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>6-month overview</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className={`flex items-center gap-1.5 ${dark ? "text-slate-300" : "text-slate-600"}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />Income
          </span>
          <span className={`flex items-center gap-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />Expenses
          </span>
        </div>
      </div>
      <div className="flex items-end gap-3 h-44">
        {MONTHLY_DATA.map((m, i) => (
          <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end gap-0.5 h-36">
              {/* Income bar */}
              <div className="flex-1 flex items-end rounded-t-lg overflow-hidden" style={{ height: "100%" }}>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-teal-600 to-teal-300 transition-all duration-700"
                  style={{ height: animated ? `${(m.income / max) * 100}%` : "0%", transitionDelay: `${i * 80}ms` }}
                />
              </div>
              {/* Expense bar */}
              <div className="flex-1 flex items-end rounded-t-lg overflow-hidden" style={{ height: "100%" }}>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-rose-600 to-rose-300 transition-all duration-700"
                  style={{ height: animated ? `${(m.expenses / max) * 100}%` : "0%", transitionDelay: `${i * 80 + 40}ms` }}
                />
              </div>
            </div>
            <span className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>{m.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Donut Chart ────────────────────────────────────────────────────── */
function DonutChart({ transactions }) {
  const { darkMode: dark } = useApp();
  const expenses = transactions.filter(t => t.type === "expense");
  const total    = expenses.reduce((s, t) => s + t.amount, 0);

  const catMap = {};
  expenses.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  const cats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  let offset = 0;
  const r = 56, cx = 70, cy = 70, circ = 2 * Math.PI * r;
  const segments = cats.map(([cat, amt]) => {
    const pct = (amt / total) * 100;
    const seg = { cat, amt, pct, offset };
    offset += pct;
    return seg;
  });

  return (
    <div className={`rounded-2xl p-5 ${dark ? "bg-slate-800/70 border border-slate-700/50" : "bg-white border border-slate-100 shadow-sm"}`}>
      <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-slate-900"}`}>Spending Breakdown</h3>
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* SVG donut */}
        <div className="relative flex-shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={dark ? "#1e293b" : "#f1f5f9"} strokeWidth="18" />
            {segments.map((s, i) => (
              <circle key={s.cat} cx={cx} cy={cy} r={r} fill="none"
                stroke={CAT_COLORS[s.cat] || "#94a3b8"} strokeWidth="18"
                strokeDasharray={`${(s.pct / 100) * circ} ${circ}`}
                strokeDashoffset={-((s.offset / 100) * circ)}
                strokeLinecap="butt"
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Spent</span>
            <span className={`text-sm font-bold font-mono ${dark ? "text-white" : "text-slate-900"}`}>{fmt(total)}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 flex flex-col gap-2.5 w-full">
          {segments.map(s => (
            <div key={s.cat} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CAT_COLORS[s.cat] }} />
              <span className={`text-xs flex-1 ${dark ? "text-slate-300" : "text-slate-600"}`}>{s.cat}</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: dark ? "#334155" : "#e2e8f0" }}>
                <div className="h-full rounded-full" style={{ width:`${s.pct}%`, background: CAT_COLORS[s.cat], transition:"width 1s ease" }} />
              </div>
              <span className={`text-xs font-mono w-14 text-right ${dark ? "text-slate-400" : "text-slate-500"}`}>{fmt(s.amt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Recent Transactions ────────────────────────────────────────────── */
function RecentTransactions({ transactions }) {
  const { darkMode: dark, setActivePage } = useApp();
  return (
    <div className={`rounded-2xl p-5 ${dark ? "bg-slate-800/70 border border-slate-700/50" : "bg-white border border-slate-100 shadow-sm"}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Recent Transactions</h3>
        <button onClick={() => setActivePage("transactions")}
          className="text-xs text-teal-500 hover:text-teal-400 font-medium transition-colors">
          View all →
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {transactions.slice(0, 5).map((t, i) => (
          <div key={t.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all animate-slide-up delay-${(i+1)*100} ${
              dark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
            }`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ background: (CAT_COLORS[t.category] || "#94a3b8") + "22" }}>
              {CATEGORY_ICONS[t.category] || "💸"}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${dark ? "text-white" : "text-slate-800"}`}>{t.description}</p>
              <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{t.category} · {fmtDate(t.date)}</p>
            </div>
            <span className={`text-sm font-mono font-semibold ${t.type === "income" ? "text-teal-400" : "text-rose-400"}`}>
              {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Dashboard Page ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const { transactions, totalIncome, totalExpense, balance } = useApp();
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title="Total Balance" value={balance}      icon="🏦" gradient="from-teal-400 to-cyan-500"    sub="All time net"  delay="delay-100" />
        <SummaryCard title="Total Income"  value={totalIncome}  icon="📈" gradient="from-emerald-400 to-green-500" sub="All sources"   delay="delay-200" />
        <SummaryCard title="Total Expenses"value={totalExpense} icon="📉" gradient="from-rose-400 to-pink-500"    sub="All categories"delay="delay-300" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChart />
        <DonutChart transactions={transactions} />
      </div>
      <RecentTransactions transactions={transactions} />
    </div>
  );
}