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
        // Brand palette — FitTrack
        primary: {
          DEFAULT: "#0066FF",
          50:  "#EBF2FF",
          100: "#D6E6FF",
          200: "#ADCBFF",
          300: "#7AADFF",
          400: "#4D92FF",
          500: "#0066FF",
          600: "#0052CC",
          700: "#003D99",
          800: "#002966",
          900: "#001433",
        },
        background: "#F5F7FA",
        foreground: "#181829",
        card: "#FFFFFF",
        // Neutral scale
        neutral: {
          50:  "#F5F7FA",
          100: "#EAEDF2",
          200: "#D5D9E0",
          300: "#B2B7C0",
          400: "#8E95A0",
          500: "#6B7180",
          600: "#4E5460",
          700: "#363C47",
          800: "#222730",
          900: "#181829",
        },
        success: {
          DEFAULT: "#19C262",
          light: "#E3F9ED",
        },
        warning: {
          DEFAULT: "#FF710A",
          light: "#FFF0E8",
        },
        gold: {
          DEFAULT: "#FEC80D",
          light: "#FFF9E0",
        },
        destructive: {
          DEFAULT: "#EF4444",
          light: "#FEE2E2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 4px 0 rgba(0,0,0,0.06), 0 4px 16px 0 rgba(0,0,0,0.04)",
        "card-hover": "0 4px 20px 0 rgba(0,0,0,0.10)",
        "primary-glow": "0 4px 24px 0 rgba(0,102,255,0.24)",
      },
      screens: {
        xs: "390px",
      },
    },
  },
  plugins: [],
};

export default config;
