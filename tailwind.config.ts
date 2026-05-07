import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm)", "system-ui", "sans-serif"],
      },
      colors: {
        accent: "#e8ff47",
        void: "#0a0a0a",
        surface: "#111",
        line: "#1e1e1e",
      },
    },
  },
  plugins: [],
};

export default config;
