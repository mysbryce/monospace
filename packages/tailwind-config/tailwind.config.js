/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{src,app}/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}