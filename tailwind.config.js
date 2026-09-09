/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        street: {
          charcoal: '#121316',
          surface: '#1A1C23',
          card: '#222530',
          border: '#2E3240',
          amber: '#F59E0B',
          orange: '#FF5722',
          red: '#EF4444',
          green: '#10B981',
          gold: '#EAB308',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 1s ease-in-out 2',
      }
    },
  },
  plugins: [],
}
