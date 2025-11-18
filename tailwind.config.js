/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-violet': '#d15fff',
        'neon-blue': '#4df9ff',
        'neon-red': '#ff4747',
        'neon-cyan': '#00f2ea',
        'neon-green': '#39ff14',
        'neon-orange': '#ff8c00',
        'neon-pink': '#ff1493',
        'neon-ultra-orange': '#ff7f00',
        'neon-diynamic-blue': '#007bff',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
