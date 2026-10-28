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
        // `ink` is the purple foundation, anchored exactly on #140926.
        // The rest of the scale stays in that deep, muted family for
        // surfaces and gradients, while ivory text and gold details sit on top.
        ink: {
          950: '#140926',
          900: '#200b35',
          850: '#291240',
          800: '#341b4e',
          700: '#44275f',
          600: '#563672',
          500: '#6d4c88',
        },
        // Royal purple — the glow/accent scale. It is deliberately kept
        // inside the same muted #140926 family as `ink`; using a vivid
        // royal here would repaint large blurred areas bright purple even
        // when the flat foundation underneath is exact.
        royal: {
          50: '#f4eef9',
          100: '#e7dbf1',
          200: '#d0bce0',
          300: '#a98dbc',
          400: '#6d4c88',
          500: '#563672',
          600: '#44275f',
          700: '#341b4e',
          800: '#200b35',
          900: '#140926',
        },
        // Metallic gold, anchored exactly on #d4af37 at gold-400.
        // The lighter and deeper stops are only tints/shades around that
        // brand gold; primary gold surfaces use gold-400 itself.
        gold: {
          50: '#fbf3d5',
          100: '#f7e7ac',
          200: '#f1d27a',
          300: '#e6bd4a',
          400: '#d4af37',
          500: '#b8922e',
          600: '#98751f',
          700: '#775a16',
          800: '#57410f',
        },
        // Alabaster-ivory: warm cream for the main text against the
        // Imperial Velvet Plum foundation, with paler lavender tints below.
        ivory: {
          50: '#FAF6F0',
          100: '#f6f0fc',
          200: '#ece1f6',
          300: '#ddd0f2',
          400: '#bfabe0',
          500: '#9e87c2',
        },
        // Formerly blush-pink; now the soft lilac accent scale
        // (token name kept for compatibility).
        blush: {
          50: '#f7f2fb',
          100: '#eee4f6',
          200: '#dcc9ed',
          300: '#bda0d4',
          400: '#8a6aa3',
          500: '#6d4c88',
          600: '#563672',
          700: '#44275f',
        },
        wine: '#140926',
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
