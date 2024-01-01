/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#012030'
      },
      fontWeight: {
        normal: 800 // Normal font ağırlığını 500 olarak ayarla
      },
      fontSize: {
        sm: '1rem',
        base: '1.2rem',
        xl: '1.5rem',
        '2xl': '1.6rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

