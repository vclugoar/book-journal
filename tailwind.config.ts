import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light mode - Cozy palette
        cream: {
          DEFAULT: "#FDF6E3",
          50: "#FFFEF9",
          100: "#FDF6E3",
          200: "#F7ECCC",
          300: "#F0E0B5",
        },
        rose: {
          DEFAULT: "#D4A5A5",
          light: "#E8C4C4",
          dark: "#B88888",
        },
        sage: {
          DEFAULT: "#9CAF88",
          light: "#B8C7A8",
          dark: "#7A8F68",
        },
        golden: {
          DEFAULT: "#E6C068",
          light: "#F0D48A",
          dark: "#D4A84A",
        },
        brown: {
          DEFAULT: "#8B7355",
          light: "#A8927A",
          dark: "#6B5540",
        },
        // Dark mode - Nighttime Reading
        night: {
          DEFAULT: "#1A1A2E",
          light: "#16213E",
          navy: "#0F3460",
          cream: "#E8DFD0",
        },
        // Semantic colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "sparkle": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 5px var(--golden)" },
          "50%": { boxShadow: "0 0 20px var(--golden), 0 0 30px var(--golden)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "sparkle": "sparkle 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
