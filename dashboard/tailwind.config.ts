import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#F1F5EE",
        card: "#DDEBD8",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#3FBF6F",
          hover: "#34A85F",
          soft: "#A8E0BC",
        },
        ink: {
          heading: "#0E1B2C",
          body: "#1F2A37",
          muted: "#6B7280",
          label: "#1B3A5B",
        },
        danger: "#E53935",
        warn: "#F0B429",
        info: "#1B3A5B",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        input: "12px",
      },
    },
  },
  plugins: [],
} satisfies Config;
