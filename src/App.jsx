import { AppProvider, useApp } from "./context/AppContext";
import Navbar       from "./components/Navbar";
import Dashboard    from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Insights     from "./components/Insights";

function RoleBadge() {
  const { role, darkMode } = useApp();
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
      role === "Admin"
        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
    }`}>
      <div className="ring-pulse">
        <div className={`w-2 h-2 rounded-full ${role==="Admin" ? "bg-amber-500" : "bg-slate-400"}`} />
      </div>
      {role}
    </div>
  );
}

function AppInner() {
  const { activePage, darkMode } = useApp();
  const titles = { dashboard:"Financial Overview", transactions:"Transactions", insights:"Insights & Analytics" };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-slate-900" : "bg-slate-50"}`}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              {titles[activePage]}
            </h1>
            <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
            </p>
          </div>
          <RoleBadge />
        </div>

        {/* Page content */}
        <div className="animate-fade-in">
          {activePage === "dashboard"    && <Dashboard    />}
          {activePage === "transactions" && <Transactions />}
          {activePage === "insights"     && <Insights     />}
        </div>
      </main>

      <footer className={`text-center py-6 text-xs ${darkMode ? "text-slate-600" : "text-slate-400"}`}>
        © 2026 FinFlow · Built for Zorvyn FinTech Internship Assessment
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}