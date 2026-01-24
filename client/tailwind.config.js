/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // gray-200
        input: 'var(--color-input)', // white
        ring: 'var(--color-ring)', // gold
        background: 'var(--color-background)', // gray-50
        foreground: 'var(--color-foreground)', // gray-800
        primary: {
          DEFAULT: 'var(--color-primary)', // gray-900
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // gray-600
          foreground: 'var(--color-secondary-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-800
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-100
          foreground: 'var(--color-muted-foreground)', // gray-500
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // gold
          foreground: 'var(--color-accent-foreground)', // gray-900
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)', // gray-800
        },
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)', // gray-800
        },
        success: {
          DEFAULT: 'var(--color-success)', // green-800
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-800
          foreground: 'var(--color-warning-foreground)', // white
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-800
          foreground: 'var(--color-error-foreground)', // white
        },
      },
      fontFamily: {
        headline: ['Crimson Pro', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
        cta: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0,0,0,0.1)',
        'elevation-2': '0 4px 12px rgba(0,0,0,0.05)',
        'elevation-3': '0 8px 25px rgba(0,0,0,0.08)',
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'rotate-mesh': 'rotate-mesh 20s linear infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'rotate-mesh': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(0.5deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}