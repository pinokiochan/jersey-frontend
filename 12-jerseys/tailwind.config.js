/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DB1F1F', // Arsenal red
        lightGrey: '#F5F5F5',
        darkGrey: '#333333',
      },
    },
  },
  plugins: [],
}
