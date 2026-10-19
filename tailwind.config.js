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
        // Her colours: purple and gold.
        // `ink` is the royal-purple foundation — lifted well clear of black
        // (near-black plum read as black), so the site is unmistakably purple at a
        // glance while still dark enough for ivory text and gold details.
        ink: {
          950: '#36145e',
          900: '#40196d',
          850: '#491f7a',
          800: '#54268c',
          700: '#65339f',
          600: '#7a45b3',
          500: '#8f5cc4',
        },
        // Royal purple — the vivid end of the plum scale, for glows,
        // accents and moments where the purple should be felt, not just seen.
        royal: {
          50: '#f5efff',
          100: '#ede0ff',
          200: '#d8c2ff',
          300: '#be9bf5',
          400: '#a06fe0',
          500: '#7e3fc4',
          600: '#62269f',
          700: '#4a187c',
          800: '#351058',
          900: '#24083d',
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
        // Lilac-ivory: the warm ivory cooled into the purple family, so
        // light sections read as pale lavender against the royal plum.
        ivory: {
          50: '#fdfaff',
          100: '#f6f0fc',
          200: '#ece1f6',
          300: '#ddd0f2',
          400: '#bfabe0',
          500: '#9e87c2',
        },
        // Formerly blush-pink; now the soft lilac accent scale
        // (token name kept for compatibility).
        blush: {
          50: '#faf5ff',
          100: '#f1e6fd',
          200: '#e0ccfa',
          300: '#c4a3ec',
          400: '#a678dd',
          500: '#8550c4',
          600: '#68369f',
          700: '#502578',
        },
        wine: '#1e0836',
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
