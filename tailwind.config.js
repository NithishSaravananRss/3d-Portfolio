/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jet: {
          DEFAULT: '#0a0a0a',
          50: '#1e1e1e',
          100: '#161616',
          200: '#121212',
          300: '#0e0e0e',
          card: '#111114',
          border: '#1f1f26'
        },
        gold: {
          DEFAULT: '#E5B869',
          light: '#FFF6E5',
          glow: '#FFDF9E',
          dark: '#996D28',
          amber: '#D4A373',
        },
        cerulean: {
          DEFAULT: '#E5B869',
          light: '#FFF6E5',
          glow: '#FFDF9E',
          dark: '#996D28',
        },
        neonRose: {
          DEFAULT: '#D4A373',
          light: '#E8C4A2',
          glow: '#E5B869',
          dark: '#8C5E32',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(229, 184, 105, 0.45)',
        'glow-gold-lg': '0 0 50px rgba(229, 184, 105, 0.65)',
        'glow-cerulean': '0 0 25px rgba(229, 184, 105, 0.45)',
        'glow-cerulean-lg': '0 0 50px rgba(229, 184, 105, 0.65)',
        'glow-rose': '0 0 25px rgba(212, 163, 115, 0.4)',
        'glow-rose-lg': '0 0 50px rgba(212, 163, 115, 0.6)',
        'glow-mixed': '0 0 35px rgba(229, 184, 105, 0.35), 0 0 45px rgba(212, 163, 115, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'lightning': 'lightning 0.2s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        lightning: {
          '0%': { opacity: '0.9', filter: 'brightness(1.2)' },
          '100%': { opacity: '1', filter: 'brightness(1.8)' },
        }
      }
    },
  },
  plugins: [],
}
