/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      },
      colors: {
        'sky-green': '#23BEAC',
        'sky-blue': '#1691A7',
      },
      spacing: {
        '128': '32rem',
        '140': '50rem',
      },
    },
  },
  plugins: [require("daisyui")],
}