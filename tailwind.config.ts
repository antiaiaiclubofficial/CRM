import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans Thai", "sans-serif"],
      },
      colors: {
        border: "rgba(24, 35, 74, 0.05)",
        input: "rgba(24, 35, 74, 0.05)",
        ring: "#18234A",
        background: "#F9F9F9",
        foreground: "#18234A",
        primary: {
          DEFAULT: "#020d35",
          foreground: "#FFFFFF",
          container: "#18234a",
        },
        secondary: {
          DEFAULT: "#5c5b7d",
          foreground: "#FFFFFF",
          container: "#d9d6fe",
        },
        tertiary: {
          DEFAULT: "#EAFD69",
          foreground: "#18234A",
          fixed: "#EAFD69",
          "fixed-dim": "#bed041",
        },
        surface: {
          DEFAULT: "#F9F9F9",
          dim: "#dadada",
          bright: "#f9f9f9",
          variant: "#45464E",
          container: {
            lowest: "#FFFFFF",
            low: "#F3F3F3",
            DEFAULT: "#eeeeee",
            high: "#e8e8e8",
            highest: "#e2e2e2",
          }
        },
        destructive: {
          DEFAULT: "#ba1a1a",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F3F3",
          foreground: "#45464E",
        },
      },
      borderRadius: {
        full: "9999px",
        xl: "3rem",
        lg: "2rem",
        md: "1.5rem",
        sm: "1rem",
      },
      boxShadow: {
        'ambient': '0 20px 40px rgba(24, 35, 74, 0.04)',
        'glass': '0 8px 32px 0 rgba(24, 35, 74, 0.08)',
      },
      backgroundImage: {
        'liquid-primary': 'linear-gradient(135deg, #18234a 0%, #020d35 100%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;