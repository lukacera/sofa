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
        main: "#FFCF9D",
        secondary: "#DE8F5F",
        mainDarker: "#FFB26F",
        secondaryDarker: "#740938",
        mainWhite: "#F7F7F7",
      },
    },
  },
  plugins: [],
} satisfies Config;
