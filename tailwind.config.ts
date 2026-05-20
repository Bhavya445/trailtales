import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        forest: { DEFAULT: "#1C3A2A", deep: "#13281D" },
        terracotta: { DEFAULT: "#C4622D", soft: "#E08A5A" },
        ink: "#2C2C2C",
        muted: "#6B6B6B"
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"]
      },
      borderRadius: { xl: "12px" },
      boxShadow: {
        card: "0 1px 2px rgba(28,28,28,0.04), 0 8px 24px rgba(28,58,42,0.06)",
        cardHover: "0 4px 8px rgba(28,28,28,0.06), 0 16px 40px rgba(28,58,42,0.10)"
      }
    }
  },
  plugins: []
};
export default config;
