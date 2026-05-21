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
      colors: {
        border: "rgba(24, 35, 74, 0.05)",
        input: "rgba(24, 35, 74, 0.05)",
        ring: "#18234A",
        background: "#F9F9F9",
        foreground: "#18234A",
        primary: {
          DEFAULT: "#18234A",
          foreground: "#FFFFFF",
          container: "#020D35",
        },
        secondary: {
          DEFAULT: "#F3F3F3",
          foreground: "#18234A",
          container: "#D9D6FE",
        },
        tertiary: {
          DEFAULT: "#EAFD69",
          foreground: "#18234A",
        },
        surface: {
          DEFAULT: "#F9F9F9",
          low: "#F3F3F3",
          lowest: "#FFFFFF",
          variant: "#45464E",
        },
        destructive: {
          DEFAULT: "#8E171D",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F3F3",
          foreground: "#45464E",
        },
        accent: {
          DEFAULT: "#C5805D",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        "3xl": "3rem",
        "2xl": "2rem",
        xl: "1.5rem",
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        'ambient': '0 20px 40px rgba(24, 35, 74, 0.04)',
        'glass': '0 8px 32px 0 rgba(24, 35, 74, 0.08)',
      },
      backgroundImage: {
        'liquid-primary': 'linear-gradient(135deg, #18234A 0%, #020D35 100%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;