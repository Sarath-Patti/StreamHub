/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed',
          600: '#6d28d9',
        },
        accent: {
          400: '#f472b6',
          500: '#ec4899',
        },
        surface: {
          500: '#32324a',
          600: '#27273a',
          700: '#1f1f2a',
          800: '#17171e',
          900: '#0f0f13',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 400ms ease both',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 1.2s linear infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 16px -4px rgba(124,58,237,0.6)' },
          '50%':       { boxShadow: '0 0 32px -4px rgba(124,58,237,0.9)' },
        },
      },
      backdropBlur: {
        sm: '4px',
        md: '12px',
        lg: '20px',
      },
    },
  },
  plugins: [],
};
