# 💰 Finance Dashboard

A modern and responsive Finance Dashboard built using React (Vite) and Tailwind CSS. It helps users track income, expenses, and overall balance with a clean and interactive UI.

Live Demo: https://finance-dashboard-taupe-omega.vercel.app/

---

## 🚀 Features

- Displays total balance, income, and expenses
- Automatically calculates financial summary from transactions
- Shows list of all transactions
- Differentiates income and expense visually
- Clean and modern dark UI
- Responsive design (mobile, tablet, desktop)
- Smooth hover effects and transitions

---

## 🛠️ Tech Stack

- React.js (Vite)
- Tailwind CSS
- Context API (State Management)
- Vercel (Deployment)

---

## ⚙️ Setup Instructions

1. Clone the repository
   git clone <https://github.com/KAVYA-05code/finance-dashboard>

2. Navigate to project folder
   cd finance-dashboard

3. Install dependencies
   npm install

4. Run development server
   npm run dev

5. Open in browser
   http://localhost:5173/

---

## 📁 Project Structure

- components/ → UI components (Dashboard)
- context/ → Global state management
- data/ → Initial transaction data
- App.jsx → Main component
- main.jsx → Entry point
- index.css → Styling

---

## 🧠 Approach

- Used Context API for global state management
- Separated data, logic, and UI for better structure
- Calculations handled dynamically:
  - Income = sum of positive values
  - Expense = sum of negative values
  - Balance = income + expense

---

## ⚙️ How It Works

- Transactions are stored in global state
- Each transaction has title and amount
- Positive values = income
- Negative values = expense
- UI updates automatically when data changes

---

## 🔮 Future Improvements

- Add new transaction feature
- Delete transactions
- Add charts and analytics
- Backend integration (API + database)
- User authentication

---

## 👨‍💻 Author

KAVYA D

---
