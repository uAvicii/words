/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'familiar-simple': '#10b981',
        'familiar-forget': '#f59e0b',
        'new-word': '#ef4444',
        'confused': '#8b5cf6',
        'mastered': '#6b7280'
      }
    },
  },
  plugins: [],
}
