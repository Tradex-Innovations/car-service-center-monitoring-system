import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#f7f8fb",
        line: "#e5e7eb"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(17, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
