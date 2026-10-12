/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 4px 20px rgba(15, 23, 42, 0.04)',
      },
      colors: {
        navy: '#0B1F3A',
        navyLight: '#163B63',
        teal: '#0EA5A8',
        tealHover: '#0B8F92',
        cyan: '#38BDF8',
      },
    },
  },
  plugins: [],
}

