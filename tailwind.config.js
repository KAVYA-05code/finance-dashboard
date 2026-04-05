/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#13131a",
        surface2: "#1c1c28",
        surface3: "#242436",
        bg: "#0a0a0f",
        accent: "#7c6aff",
        accent2: "#a89cff",
      },
    },
  },
  plugins: [],
};