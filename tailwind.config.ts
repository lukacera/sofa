import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#a8dadc",
        primaryDarker: "#1d3557",
        secondary: "#457b9d",
        accent: "#e63946",
        mainWhite: "#f1faee",
      },
    },
  },
  plugins: [],
} satisfies Config;
