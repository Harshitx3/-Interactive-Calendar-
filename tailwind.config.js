/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        calendar: {
          primary: '#3b82f6',
          secondary: '#10b981',
          bg: '#f8fafc',
          text: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
