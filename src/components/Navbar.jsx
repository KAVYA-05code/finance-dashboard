import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { darkMode, setDarkMode, role, setRole, activePage, setActivePage } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const dark = darkMode;

  const navItems = [
    { id:"dashboard",    label:"Dashboard"    },
    { id:"transactions", label:"Transactions" },
    { id:"insights",     label:"Insights"     },
  ];

  return (
    <nav className={`sticky top-0 z-50 glass border-b ${dark ? "bg-slate-900/90 border-slate-700/50" : "bg-white/90 border-slate-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30 animate-float">
              <span className="text-white text-sm font-bold">₹</span>
            </div>
            <span className={`text-xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
              Fin<span className="shimmer-text">Flow</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className={`hidden md:flex items-center gap-1 p-1 rounded-xl ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActivePage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activePage === item.id
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/30"
                    : dark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                }`}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <select value={role} onChange={e => setRole(e.target.value)}
              className={`text-sm font-medium rounded-lg px-3 py-1.5 border transition-all ${
                dark ? "bg-slate-800 text-teal-400 border-slate-700" : "bg-teal-50 text-teal-700 border-teal-200"
              }`}>
              <option value="Admin">👑 Admin</option>
              <option value="Viewer">👁 Viewer</option>
            </select>

            <button onClick={() => setDarkMode(!dark)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                dark ? "bg-slate-800 text-yellow-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              {dark ? "☀️" : "🌙"}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center ${dark ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"}`}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 flex flex-col gap-1 animate-slide-up">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setActivePage(item.id); setMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activePage === item.id
                    ? "bg-teal-500 text-white"
                    : dark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                }`}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}