/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../design-system/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'serif': ['"Source Serif 4"', 'Georgia', 'serif'],
        'display': ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      colors: {
        nv: {
          primary: '#0f2747',
          'primary-dark': '#091a30',
          'primary-mid': '#163b6b',
          accent: '#ff6719',
          'accent-dark': '#d85612',
          text: '#0f172a',
          soft: '#f1f5f9'
        }
      },
      letterSpacing: {
        'tight-headline': '-0.02em',
      }
    },
  },
  plugins: [],
}
