import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        papel:         '#F4EFE6',
        tinta:         '#1A1714',
        acento:        '#B8821C',
        'acento-soft': '#C9A227',
        'acento-deep': '#8F5E1A',
        lino:          '#E8DFCE',
        cuero:         '#8B7F70',
        blanco:        '#FDFBF8',
      },
      fontFamily: {
        display: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans:    ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
