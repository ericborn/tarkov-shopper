/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark", 
      {
        tarkov: {
         "primary": "#9A8866",             
         "base-100": "#090809",
         "warning": "#e06d00",       
         "error": "#991b1b",
          },
      }],
  }
}

