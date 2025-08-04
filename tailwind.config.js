/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-red-100',
    'bg-green-100', 
    'bg-blue-100',
    'bg-yellow-100',
    'text-red-600',
    'text-green-600',
    'text-blue-600',
    'text-yellow-600',
    'text-orange-600'
  ]
}