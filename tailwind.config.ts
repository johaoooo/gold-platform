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
        gold: "#22c55e",           // émeraude principal
        "gold-light": "#4ade80",   // émeraude clair
        "gold-glow": "#86efac",    // émeraude très clair / glow
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