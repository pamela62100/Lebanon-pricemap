import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: [],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          muted: 'var(--bg-muted)',
        },
        text: {
          main: 'var(--text-main)',
          sub: 'var(--text-sub)',
          muted: 'var(--text-muted)',
        },
        border: {
          primary: 'var(--border-primary)',
          soft: 'var(--border-soft)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          soft: 'var(--primary-soft)',
          glow: 'var(--primary-glow)',
        },
        status: {
          flagged: {
            bg: 'var(--status-flagged-bg)',
            text: 'var(--status-flagged-text)',
          },
          verified: {
            bg: 'var(--status-verified-bg)',
            text: 'var(--status-verified-text)',
          },
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        glass: 'var(--shadow-glass)',
        gold: 'var(--shadow-gold)',
      },
      backgroundImage: {
        'gradient-gold': 'var(--gradient-gold)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
} satisfies Config;
