import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#05090a",
        surface: "#0a120b",
        "surface-2": "#111a12",    // ✅ ajouté — manquait
        gold: "#22c55e",
        "gold-light": "#4ade80",
        "gold-glow": "#86efac",
        "text-1": "#ffffff",
        "text-2": "#8fa894",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        playfair: ['"Playfair Display"', "serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
