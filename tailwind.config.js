/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          amber: '#FF8F1F', // Neón Ambarino
        },
        brand: {
          burgundy: '#6E323A', 
          dark: '#000000',     
          gray: '#634560',     
          cream: '#FFFEEA',    
        }
      },
      boxShadow: {
        'neon': '0 0 5px #FF8F1F, 0 0 20px #FF8F1F', 
      }
    },
  },
  plugins: [],
}