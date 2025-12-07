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
          50: "#f5f3ff",
          100: "#ede8ff",
          200: "#ddd5ff",
          300: "#c7b3ff",
          400: "#a080ff",
          500: "#7c5dff",
          600: "#6b3cff",
          700: "#5a2d9f",
          800: "#3d1e6f",
          900: "#1a0f42"
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
