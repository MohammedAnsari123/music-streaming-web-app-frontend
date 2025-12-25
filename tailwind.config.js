/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0E0E10",
        surface: "#1F1F23",
        border: "#2A2A2E",
        textPrimary: "#EDEDED",
        textSecondary: "#A1A1AA",
        accent: "#22C55E"
      }
    },
  },
  plugins: [],
}

