/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#f8f5ef',
        'sand-dark': '#e6dccb',

        ink: '#1f2937',
        slate: '#64748b',

        saffron: '#f97316',
        'saffron-dark': '#ea580c',

        primary: {
          DEFAULT: '#1e3a5f',
          light: '#2d5282',
          dark: '#162d4a',
        },

        accent: {
          DEFAULT: '#f97316',
          light: '#fb923c',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};