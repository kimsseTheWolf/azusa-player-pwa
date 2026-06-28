import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: 'rgb(255 255 255)',
        card: 'rgb(255 255 255 / 0.05)',
        border: 'rgb(255 255 255 / 0.15)',
        shadow: 'rgb(0 0 0 / 0.25)',
        system: {
          blue: '#0a84ff',
          red: '#ff453a',
          orange: '#ff9f0a',
          yellow: '#ffd60a',
          green: '#30d158',
          mint: '#63e6be',
          cyan: '#64d2ff',
          purple: '#bf5af2',
        },
      },
      borderRadius: {
        round: '100px',
        normal: '20px',
        small: '10px',
      },
      spacing: {
        'page-x': '25px',
        card: '10px',
        'card-gap': '15px',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      boxShadow: {
        component: '0 4px 5px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        component: '15px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['24px', { lineHeight: '1.15', fontWeight: '700' }],
        'page-subtitle': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        action: ['14px', { lineHeight: '1.3', fontWeight: '600' }],
        small: ['12px', { lineHeight: '1.35', fontWeight: '500' }],
      },
      backgroundImage: {
        'glass-depth':
          'radial-gradient(circle at top, rgb(255 255 255 / 0.12), transparent 40%), linear-gradient(180deg, rgb(255 255 255 / 0.08), rgb(255 255 255 / 0.02))',
      },
    },
  },
  plugins: [],
}

export default config