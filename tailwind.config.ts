import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
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
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        input: "12px",
      },
      maxWidth: {
        container: "1200px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "storefront-rise": {
          "0%": { opacity: "0", transform: "translateY(28px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "storefront-fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "storefront-scale-in": {
          "0%": { opacity: "0", transform: "scale(0.82)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "storefront-banner-drift": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
      },
      animation: {
        "storefront-rise":
          "storefront-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) both",
        "storefront-fade-up":
          "storefront-fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "storefront-scale-in":
          "storefront-scale-in 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "storefront-banner-drift":
          "storefront-banner-drift 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
