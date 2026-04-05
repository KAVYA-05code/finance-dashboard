export const initialTransactions = [
  { id:  1, date:"2026-04-01", description:"Salary Credit",       category:"Income",        amount:85000, type:"income"  },
  { id:  2, date:"2026-04-01", description:"Netflix Subscription", category:"Entertainment", amount:649,   type:"expense" },
  { id:  3, date:"2026-03-31", description:"Grocery Store",        category:"Food",          amount:3200,  type:"expense" },
  { id:  4, date:"2026-03-30", description:"Electricity Bill",     category:"Utilities",     amount:1850,  type:"expense" },
  { id:  5, date:"2026-03-29", description:"Freelance Project",    category:"Income",        amount:32000, type:"income"  },
  { id:  6, date:"2026-03-28", description:"Swiggy Order",         category:"Food",          amount:540,   type:"expense" },
  { id:  7, date:"2026-03-27", description:"Uber Ride",            category:"Transport",     amount:280,   type:"expense" },
  { id:  8, date:"2026-03-26", description:"Amazon Shopping",      category:"Shopping",      amount:4200,  type:"expense" },
  { id:  9, date:"2026-03-25", description:"Dividend Credit",      category:"Income",        amount:5600,  type:"income"  },
  { id: 10, date:"2026-03-24", description:"Gym Membership",       category:"Health",        amount:2000,  type:"expense" },
  { id: 11, date:"2026-03-23", description:"Water Bill",           category:"Utilities",     amount:380,   type:"expense" },
  { id: 12, date:"2026-03-22", description:"Spotify Premium",      category:"Entertainment", amount:119,   type:"expense" },
  { id: 13, date:"2026-03-21", description:"Rent Payment",         category:"Housing",       amount:15000, type:"expense" },
  { id: 14, date:"2026-03-20", description:"Online Course",        category:"Education",     amount:1999,  type:"expense" },
  { id: 15, date:"2026-03-19", description:"Ola Cab",              category:"Transport",     amount:210,   type:"expense" },
  { id: 16, date:"2026-03-18", description:"Consulting Fee",       category:"Income",        amount:18000, type:"income"  },
  { id: 17, date:"2026-03-17", description:"Pharmacy",             category:"Health",        amount:760,   type:"expense" },
  { id: 18, date:"2026-03-16", description:"Coffee Shop",          category:"Food",          amount:340,   type:"expense" },
  { id: 19, date:"2026-03-15", description:"Zepto Groceries",      category:"Food",          amount:1820,  type:"expense" },
  { id: 20, date:"2026-03-14", description:"Myntra Purchase",      category:"Shopping",      amount:2800,  type:"expense" },
];

export const MONTHLY_DATA = [
  { month:"Oct", income:85000,  expenses:42000 },
  { month:"Nov", income:92000,  expenses:48000 },
  { month:"Dec", income:78000,  expenses:61000 },
  { month:"Jan", income:95000,  expenses:39000 },
  { month:"Feb", income:88000,  expenses:44000 },
  { month:"Mar", income:140600, expenses:34107 },
];

export const CAT_COLORS = {
  Food:"#f97316", Shopping:"#8b5cf6", Transport:"#06b6d4",
  Entertainment:"#ec4899", Utilities:"#10b981", Health:"#ef4444",
  Housing:"#f59e0b", Education:"#3b82f6", Income:"#14b8a6",
};

export const CATEGORY_ICONS = {
  Food:"🍔", Shopping:"🛍️", Transport:"🚗", Entertainment:"🎬",
  Utilities:"⚡", Health:"💊", Housing:"🏠", Education:"📚", Income:"💼",
};