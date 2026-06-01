/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#020617', // premium deep black/slate
          navy: '#0b1528', // deep transport navy
          lightnavy: '#152238', // lighter navy for cards
          orange: '#f95d02', // main premium transportation orange
          orangeDark: '#c2410c', // deep orange for hover
          orangeLight: '#ff7e33', // highlight orange
          slate: '#0f172a',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 15px rgba(249, 93, 2, 0.35)',
        'glow-orange-lg': '0 0 30px rgba(249, 93, 2, 0.5)',
        'glow-navy': '0 0 20px rgba(11, 21, 40, 0.6)',
        'glass': '0 8px 32px 0 rgba(2, 6, 23, 0.5)',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, #020617, #0b1528, #020617)',
        'gradient-card': 'linear-gradient(135deg, rgba(21, 34, 56, 0.6) 0%, rgba(11, 21, 40, 0.8) 100%)',
      }
    },
  },
  plugins: [],
}
