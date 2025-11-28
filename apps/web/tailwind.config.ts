import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        etrna: {
          primary: "#00ffd5",
          dark: "#0b1221",
          accent: "#8b5cf6"
        }
      }
    }
  },
  plugins: []
};

export default config;
