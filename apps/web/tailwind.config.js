/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          50: 'hsl(174 70% 96%)',
          100: 'hsl(174 70% 90%)',
          200: 'hsl(174 66% 80%)',
          300: 'hsl(174 60% 66%)',
          400: 'hsl(174 62% 50%)',
          500: 'hsl(174 68% 41%)',
          600: 'hsl(174 72% 34%)',
          700: 'hsl(174 74% 28%)',
          800: 'hsl(174 74% 22%)',
          900: 'hsl(174 70% 16%)',
          950: 'hsl(174 72% 10%)',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.06)',
        'soft-lg': '0 2px 4px rgba(15,23,42,0.04), 0 12px 32px rgba(15,23,42,0.10)',
      },
      keyframes: {
        slidein: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        'fade-in': { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        slidein: 'slidein 0.2s ease',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
