import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // From Figma design (improved parsing)
        brown: {
          dark: "#4b2615",
          DEFAULT: "#4b2615",
          light: "#643f2e",
        },
        white: "#ffffff",
        black: "#000000",
        gray: {
          darkest: "#141414",
          dark: "#161616",
          DEFAULT: "#1e1e1e",
          light: "#d9d9d9",
        },
        background: {
          light: "#fafafa",
          DEFAULT: "#fbfbfb",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "30px",
        "3xl": "40px",
        "4xl": "42px",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        bold: "700",
      },
      lineHeight: {
        tight: "20px",
        normal: "26px",
        relaxed: "32px",
        loose: "36px",
      },
      spacing: {
        "0": "0px",
        "1": "4px",
        "2": "8px",
        "4": "16px",
        "6": "24px",
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "9px",
        "2xl": "12px",
        full: "9999px",
      },
      borderWidth: {
        DEFAULT: "1px",
        "2": "2px",
      },
      screens: {
        mobile: "768px",
        desktop: "1440px",
      },
    },
  },
  plugins: [],
};
export default config;
