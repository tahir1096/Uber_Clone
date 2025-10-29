/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uber: {
          black: '#000000',
          dark: '#111111',
          gray: '#f5f5f5',
        }
      },
    },
  },
  plugins: [],
}
