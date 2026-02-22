import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#141414',
        'bg-tertiary': '#1a1a1a',
        'bg-elevated': '#242424',
        'bg-overlay': 'rgba(0, 0, 0, 0.8)',
        'accent-primary': '#f5a623',
        'accent-secondary': '#d4a574',
        'accent-tertiary': '#8b7355',
        'accent-glow': 'rgba(245, 166, 35, 0.4)',
        'text-primary': '#e8e8e8',
        'text-secondary': '#888888',
        'text-tertiary': '#555555',
        'border-default': '#2a2a2a',
        'border-hover': '#3a3a3a',
        background: {
          primary: '#0a0a0a',
          secondary: '#141414',
          tertiary: '#1a1a1a',
          elevated: '#242424',
          overlay: 'rgba(0, 0, 0, 0.8)',
        },
        accent: {
          primary: '#f5a623',
          secondary: '#d4a574',
          tertiary: '#8b7355',
          glow: 'rgba(245, 166, 35, 0.4)',
        },
        graph: {
          node: '#f5a623',
          'node-hover': '#ffd700',
          edge: 'rgba(245, 166, 35, 0.25)',
          'edge-active': 'rgba(245, 166, 35, 0.6)',
        },
        text: {
          primary: '#e8e8e8',
          secondary: '#888888',
          tertiary: '#555555',
          accent: '#f5a623',
        },
        log: {
          success: '#4caf50',
          warning: '#ff9800',
          error: '#ff5252',
          info: '#64b5f6',
        },
        border: {
          default: '#2a2a2a',
          hover: '#3a3a3a',
          accent: 'rgba(245, 166, 35, 0.3)',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"SF Mono"', 'monospace'],
        sans: ['"Inter"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif Pro"', '"Crimson Text"', 'Georgia', 'serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3.5rem',
        '6xl': '4.5rem',
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
        cinematic: '800ms',
      },
      animation: {
        'cursor-blink': 'blink 600ms infinite',
        'pulse-slow': 'pulse 800ms infinite',
        'fade-in': 'fadeIn 250ms ease-out',
        'fadeIn': 'fadeIn 250ms ease-out',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
