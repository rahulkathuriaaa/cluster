import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700', // Gold color for accents
        secondary: '#000', // Black
        accent: '#FFD700', // Gold accent
        background: '#0a0a0a', // Dark background
        foreground: '#ededed', // Light text
        zura: {
          gold: '#FFD700',
          dark: '#0a0a0a',
          black: '#000000',
          gray: '#333333',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        pixel: ['VT323', 'monospace'], // Pixel font for the main heading
      },
      backgroundImage: {
        'grid-pattern': "url('/images/grid-bg.png')",
      },
    },
  },
  plugins: [],
};

export default config; 