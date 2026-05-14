import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#eef4ff",
        line: "rgba(148, 163, 184, 0.28)",
        glass: "rgba(255, 255, 255, 0.62)",
        "glass-strong": "rgba(255, 255, 255, 0.78)",
        "ios-blue": "#007aff",
        silver: "#f8fafc"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.10)",
        glass: "0 24px 70px rgba(15, 23, 42, 0.13), inset 0 1px 0 rgba(255, 255, 255, 0.65)",
        glow: "0 18px 44px rgba(0, 122, 255, 0.25)"
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Inter', '"Segoe UI"', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
