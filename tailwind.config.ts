import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#070B14",
        panel: "#101A2B",
        panelAlt: "#0E1624",
        accent: "#4ADE80",
        accentMuted: "#22C55E",
        danger: "#FB7185",
        textMain: "#E2E8F0",
        textMuted: "#94A3B8"
      }
    }
  },
  plugins: []
};

export default config;
