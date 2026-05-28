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
        primary: {
          DEFAULT: '#7c3aed',
          50: '#f5f3ff',
          500: '#7c3aed',
          600: '#6d28d9',
        },
        secondary: {
          DEFAULT: '#3b82f6',
          500: '#3b82f6',
          600: '#2563eb',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        dark: {
          DEFAULT: '#1f2937',
          900: '#111827',
        },
        light: '#f3f4f6',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      },
      backgroundColor: {
        dark: '#1f2937',
      },
      textColor: {
        primary: '#7c3aed',
      },
      borderColor: {
        primary: '#7c3aed',
      },
    },
  },
  plugins: [],
}
export default config
