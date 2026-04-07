/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff4c2',
          100: '#f9e7a1',
          200: '#f2db80',
          300: '#ebcf60',
          400: '#fabd2f',
          500: '#d79921',
          600: '#b57614',
          700: '#8f5e10',
          800: '#6a480d',
          900: '#4a3309',
          950: '#2f2206',
        },
        dark: {
          50: '#fbf1c7',
          100: '#f2e5bc',
          200: '#ebdbb2',
          300: '#d5c4a1',
          400: '#bdae93',
          500: '#a89984',
          600: '#928374',
          700: '#665c54',
          800: '#504945',
          900: '#3c3836',
          950: '#1d2021',
        }
      },
      fontFamily: {
          sans: ['JetBrains Mono', 'IBM Plex Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
