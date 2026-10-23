import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { 950: "#0e1013", 900: "#14171b", 800: "#1b1f25", 700: "#262b33", 600: "#343a44" },
        neon: { DEFAULT: "#39ff88", dim: "#22c765" },
        cyan: { glow: "#2de2e6" },
        mist: { 100: "#e8ecf1", 300: "#b4bcc8", 500: "#8892a1" },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', "Tahoma", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
