module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,,html}",
    "./public/index.html"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem"
    },
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      brand: {
        DEFAULT: "#1A73E8",
        light: "#4FC3F7",
        dark: "#174EA6"
      },
      accent: {
        DEFAULT: "#FFB300",
        light: "#FFE082",
        dark: "#FF8F00"
      },
      neutral: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827"
      },
      success: "#22C55E",
      warning: "#F59E42",
      error: "#EF4444",
      white: "#FFFFFF",
      black: "#000000"
    },
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      display: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      serif: ["Merriweather", "ui-serif", "Georgia", "serif"]
    },
    extend: {
      animation: {
        fade: "fade 0.5s ease-in-out",
        "slide-up": "slide-up 0.4s cubic-bezier(0.4,0,0.2,1)",
        "bounce-short": "bounce-short 0.6s"
      },
      keyframes: {
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "bounce-short": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      boxShadow: {
        card: "0 2px 8px 0 rgba(26, 115, 232, 0.08)",
        "card-hover": "0 4px 16px 0 rgba(26, 115, 232, 0.16)"
      },
      borderRadius: {
        md: "0.5rem",
        lg: "1rem"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animate")
  ]
}