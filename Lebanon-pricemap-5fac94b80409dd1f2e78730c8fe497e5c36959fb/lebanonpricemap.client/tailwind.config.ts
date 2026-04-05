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
          base:    'var(--bg-base)',
          surface: 'var(--bg-surface)',
          muted:   'var(--bg-muted)',
        },
        text: {
          main:  'var(--text-main)',
          sub:   'var(--text-sub)',
          muted: 'var(--text-muted)',
        },
        border: {
          primary: 'var(--border-primary)',
          soft:    'var(--border-soft)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover:   'var(--primary-hover)',
          soft:    'var(--primary-soft)',
          glow:    'var(--primary-glow)',
        },
        status: {
          verified: 'var(--status-verified-text)',
          pending:  'var(--status-pending-text)',
          flagged:  'var(--status-flagged-text)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card:  'var(--shadow-card)',
        glass: 'var(--shadow-glass)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      fontSize: {
        xs:   ['11px', { lineHeight: '1.5' }],
        sm:   ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.6' }],
        lg:   ['16px', { lineHeight: '1.5' }],
        xl:   ['18px', { lineHeight: '1.4' }],
        '2xl':['22px', { lineHeight: '1.3' }],
        '3xl':['28px', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
