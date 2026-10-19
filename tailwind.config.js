/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#050506',
          900: '#08080a',
          850: '#0b0b0e',
          800: '#101014',
          700: '#17171d',
          600: '#202028',
          500: '#2c2c36',
        },
        gold: {
          50: '#fcf9f1',
          100: '#f6eeda',
          200: '#ecdcb0',
          300: '#e0c88b',
          400: '#d2ae63',
          500: '#c29a4c',
          600: '#a37c37',
          700: '#7d5c28',
          800: '#5a421d',
        },
        ivory: {
          50: '#fdfbf6',
          100: '#f7f2e7',
          200: '#ece4d3',
          300: '#d9cdb6',
          400: '#b3a68d',
          500: '#8d816b',
        },
        // The one colour the house keeps apart from gold.
        blush: {
          50: '#fdf7f5',
          100: '#f9e9e5',
          200: '#f0cec7',
          300: '#e3a99f',
          400: '#d08479',
          500: '#b96258',
          600: '#97493f',
          700: '#74352d',
        },
        wine: '#1b0d11',
      },
      letterSpacing: {
        mega: '0.42em',
        widest2: '0.3em',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0, 0, 0)' },
          to: { transform: 'translate3d(-50%, 0, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        'scroll-cue': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '45%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '55%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        marquee: 'marquee 46s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        'scroll-cue': 'scroll-cue 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
