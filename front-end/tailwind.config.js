/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(180deg, rgba(103,115,200,0.7) 0%, rgba(217,181,247,0.7) 97.74%)',
      },
    },
  },
  plugins: [],
}

