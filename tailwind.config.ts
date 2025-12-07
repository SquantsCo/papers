import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#f7f7fb",
        surface: "#ffffff",
        primary: {
          50: "#f2f5ff",
          100: "#e1e7ff",
          200: "#c2ceff",
          300: "#91a9ff",
          400: "#5c7af5",
          500: "#3255e6",
          600: "#243fc0",
          700: "#1d3297",
          800: "#172874",
          900: "#111d52"
        },
        accent: {
          500: "#e0a100"
        }
      }
    }
  },
  plugins: []
};

export default config;
