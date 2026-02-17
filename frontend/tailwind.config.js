/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   darkMode: "class",
  theme: {
    extend: {
       fontFamily: {
      smooch: ['"Smooch Sans"', 'sans-serif'],
    },
    },
  },
  plugins: [],
}
