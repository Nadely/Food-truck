import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brown: {
          80: 'rgba(241, 226, 210, 0.8)',
        },
      },
      keyframes: {
        borderChange: {
          '0%': { borderColor: 'grey', borderWidth: '2px' },
          '50%': { borderColor: '#fde8e8', borderWidth: '4px' },
          '100%': { borderColor: '#fca5a5', borderWidth: '2px' },
        },
      },
      animation: {
        colorChange: 'borderChange 2s ease-in-out',
      },
       boxShadow: {
        'dark': '1px 4px 6px -1px rgba(0, 0, 0, 0.7), 0 2px 4px -2px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
} satisfies Config;
