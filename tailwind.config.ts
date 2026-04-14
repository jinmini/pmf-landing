import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./constants/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f8fb",
          100: "#e6eff7",
          500: "#1f5d82",
          600: "#194d6b",
          700: "#143f57"
        }
      },
      boxShadow: {
        soft: "0 10px 30px -20px rgba(12, 36, 56, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
