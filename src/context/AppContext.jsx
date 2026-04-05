import { createContext, useContext, useState, useEffect } from "react";
import { initialTransactions } from "../data/Data";

const AppContext = createContext();

export function AppProvider({ children }) {
  const load = (key, def) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
    catch { return def; }
  };

  const [transactions, setTransactions] = useState(() => load("fin_txns", initialTransactions));
  const [role,       setRole]       = useState("Admin");
  const [darkMode,   setDarkMode]   = useState(false);
  const [filters,    setFilters]    = useState({ type:"all", category:"all", search:"" });
  const [sortBy,     setSortBy]     = useState("date_desc");
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    localStorage.setItem("fin_txns", JSON.stringify(transactions));
  }, [transactions]);

  const totalIncome  = transactions.filter(t => t.type === "income") .reduce((s,t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s,t) => s + t.amount, 0);
  const balance      = totalIncome - totalExpense;

  const addTransaction    = tx  => setTransactions(p => [{ ...tx, id: Date.now() }, ...p]);
  const editTransaction   = (id,u) => setTransactions(p => p.map(t => t.id===id ? { ...t,...u } : t));
  const deleteTransaction = id  => setTransactions(p => p.filter(t => t.id !== id));

  return (
    <AppContext.Provider value={{
      transactions, addTransaction, editTransaction, deleteTransaction,
      role, setRole, darkMode, setDarkMode,
      filters, setFilters, sortBy, setSortBy,
      activePage, setActivePage,
      totalIncome, totalExpense, balance,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);