/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bloodred: {
          light: '#FF4D6D',
          DEFAULT: '#D72638',
          dark: '#A4161A',
        },
        crimson: '#C1121F',
        darkslate: '#1F2937',
        offwhite: '#FAF9F6',
        warmwhite: '#FCFCFC',
      },
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'premium-hover': '0 20px 40px -5px rgba(215, 38, 56, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
      },
      borderRadius: {
        '3xl': '24px',
        '2xl': '20px',
      }
    },
  },
  plugins: [],
}
