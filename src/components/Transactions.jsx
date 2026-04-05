import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { CAT_COLORS, CATEGORY_ICONS } from "../data/Data";

const fmt     = n => "₹" + Math.abs(n).toLocaleString("en-IN");
const fmtDate = d => new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
const CATS    = ["Food","Shopping","Transport","Entertainment","Utilities","Health","Housing","Education","Income","Other"];

/* ── Add / Edit Modal ───────────────────────────────────────────────── */
function TxModal({ onClose, initial = null }) {
  const { addTransaction, editTransaction, darkMode: dark } = useApp();
  const [form, setForm] = useState(initial || {
    description:"", amount:"", category:"Food", type:"expense",
    date: new Date().toISOString().slice(0,10),
  });

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = () => {
    if (!form.description.trim() || !form.amount) return;
    const tx = { ...form, amount: parseFloat(form.amount) };
    initial ? editTransaction(initial.id, tx) : addTransaction(tx);
    onClose();
  };

  const inp = `w-full rounded-xl px-4 py-2.5 text-sm font-medium border transition-all outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 ${
    dark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      style={{ background:"rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        className={`w-full max-w-md rounded-2xl p-6 animate-slide-up shadow-2xl ${
          dark ? "bg-slate-800 border border-slate-700" : "bg-white"
        }`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className={`font-bold text-lg ${dark ? "text-white" : "text-slate-900"}`}>
            {initial ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
              dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-400"
            }`}>✕</button>
        </div>
        <div className="flex flex-col gap-3">
          <input name="description" value={form.description} onChange={handle}
            placeholder="Description" className={inp} />
          <div className="grid grid-cols-2 gap-3">
            <input name="amount" value={form.amount} onChange={handle}
              placeholder="Amount (₹)" type="number" min="0" className={inp} />
            <input name="date" value={form.date} onChange={handle}
              type="date" className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select name="category" value={form.category} onChange={handle} className={inp}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
            <select name="type" value={form.type} onChange={handle} className={inp}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <button onClick={submit}
            className="w-full py-2.5 mt-1 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
            {initial ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Transactions Page ──────────────────────────────────────────────── */
export default function Transactions() {
  const { transactions, deleteTransaction, role, darkMode: dark, filters, setFilters, sortBy, setSortBy } = useApp();
  const [modal, setModal] = useState(null); // null | "new" | txObject
  const isAdmin = role === "Admin";

  const allCats = ["all", ...new Set(transactions.map(t => t.category))];

  const filtered = useMemo(() => {
    let arr = [...transactions];
    if (filters.type !== "all")     arr = arr.filter(t => t.type === filters.type);
    if (filters.category !== "all") arr = arr.filter(t => t.category === filters.category);
    if (filters.search)             arr = arr.filter(t => t.description.toLowerCase().includes(filters.search.toLowerCase()));
    const sorts = {
      date_desc: (a,b) => new Date(b.date) - new Date(a.date),
      date_asc:  (a,b) => new Date(a.date) - new Date(b.date),
      amt_desc:  (a,b) => b.amount - a.amount,
      amt_asc:   (a,b) => a.amount - b.amount,
    };
    return arr.sort(sorts[sortBy] || sorts.date_desc);
  }, [transactions, filters, sortBy]);

  const exportCSV = () => {
    const rows = [["Date","Description","Category","Type","Amount"],
      ...filtered.map(t => [t.date, t.description, t.category, t.type, t.amount])];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type:"text/csv" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download:"transactions.csv" });
    a.click();
  };

  const inp = `rounded-xl px-3 py-2 text-sm border outline-none transition-all focus:ring-2 focus:ring-teal-500/40 ${
    dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-700"
  }`;

  return (
    <div className="flex flex-col gap-4">

      {/* Filter bar */}
      <div className={`rounded-2xl p-4 flex flex-wrap gap-3 items-center ${
        dark ? "bg-slate-800/70 border border-slate-700/50" : "bg-white border border-slate-100 shadow-sm"
      }`}>
        <input placeholder="🔍  Search..." value={filters.search}
          onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
          className={`${inp} flex-1 min-w-36`} />
        <select value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))} className={inp}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value }))} className={inp}>
          {allCats.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={inp}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amt_desc">Amount: High→Low</option>
          <option value="amt_asc">Amount: Low→High</option>
        </select>
        <div className="flex gap-2 ml-auto">
          <button onClick={exportCSV}
            className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
              dark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>↓ CSV</button>
          {isAdmin && (
            <button onClick={() => setModal("new")}
              className="px-4 py-2 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-all shadow-md shadow-teal-500/20">
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl overflow-hidden ${
        dark ? "bg-slate-800/70 border border-slate-700/50" : "bg-white border border-slate-100 shadow-sm"
      }`}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl animate-float">📭</span>
            <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>No transactions match your filters</p>
            <button onClick={() => setFilters({ type:"all", category:"all", search:"" })}
              className="text-xs text-teal-500 hover:text-teal-400 font-medium transition-colors">Clear filters</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-xs uppercase tracking-widest font-semibold ${
                  dark ? "bg-slate-700/60 text-slate-400" : "bg-slate-50 text-slate-400"
                }`}>
                  <th className="text-left px-5 py-3">Description</th>
                  <th className="text-left px-5 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Date</th>
                  <th className="text-right px-5 py-3">Amount</th>
                  {isAdmin && <th className="text-right px-5 py-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id}
                    className={`border-t animate-fade-in transition-colors ${
                      dark ? "border-slate-700/50 hover:bg-slate-700/30" : "border-slate-100 hover:bg-slate-50"
                    }`}
                    style={{ animationDelay:`${i * 25}ms` }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                          style={{ background: (CAT_COLORS[t.category] || "#94a3b8") + "22" }}>
                          {CATEGORY_ICONS[t.category] || "💸"}
                        </div>
                        <span className={`text-sm font-medium ${dark ? "text-white" : "text-slate-800"}`}>{t.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold"
                        style={{ background:(CAT_COLORS[t.category]||"#94a3b8")+"22", color:CAT_COLORS[t.category]||"#94a3b8" }}>
                        {t.category}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-sm hidden md:table-cell ${dark ? "text-slate-400" : "text-slate-500"}`}>
                      {fmtDate(t.date)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`text-sm font-mono font-semibold ${t.type==="income" ? "text-teal-400" : "text-rose-400"}`}>
                        {t.type==="income" ? "+" : "-"}{fmt(t.amount)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setModal(t)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              dark ? "text-teal-400 hover:bg-teal-400/10" : "text-teal-600 hover:bg-teal-50"
                            }`}>Edit</button>
                          <button onClick={() => deleteTransaction(t.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                              dark ? "text-rose-400 hover:bg-rose-400/10" : "text-rose-500 hover:bg-rose-50"
                            }`}>Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className={`text-xs text-center ${dark ? "text-slate-600" : "text-slate-400"}`}>
        Showing {filtered.length} of {transactions.length} transactions
      </p>

      {modal && <TxModal onClose={() => setModal(null)} initial={modal === "new" ? null : modal} />}
    </div>
  );
}