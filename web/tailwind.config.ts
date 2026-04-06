import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#05050a',
          900: '#0d0d14',
          800: '#14141f',
          700: '#1c1c2e',
          600: '#252540',
        },
      },
    },
  },
  plugins: [],
}

export default config
