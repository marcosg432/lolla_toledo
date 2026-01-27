import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        /* Paleta DARK LUXURY */
        borgonha: "#4A0E1F",
        "marsala-escuro": "#611726",
        vinho: "#7B2433",
        chocolate: "#3B1F1A",
        cafe: "#1E1412",
        "preto-quente": "#0B0908",
        "cobre-escuro": "#A55B35",
        "caramelo-gold": "#C98A48",
        ambar: "#E2B07E",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-left": "fadeLeft 1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-right": "fadeRight 1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "zoom-in": "zoomIn 1.3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(32px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeLeft: { "0%": { opacity: "0", transform: "translateX(40px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        fadeRight: { "0%": { opacity: "0", transform: "translateX(-40px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        zoomIn: { "0%": { opacity: "0", transform: "scale(0.94)" }, "100%": { opacity: "1", transform: "scale(1)" } },
      },
      backgroundImage: {
        "gradient-dark-vertical": "linear-gradient(180deg, #0B0908 0%, #1E1412 25%, #1E1412 75%, #0B0908 100%)",
        "gradient-hero-dark": "linear-gradient(135deg, #1E1412 0%, #2a1a16 50%, #1E1412 100%)",
        "fade-bottom": "linear-gradient(to top, rgba(30,20,18,0.95) 0%, transparent 50%)",
      },
      boxShadow: {
        "dark-warm": "0 8px 32px rgba(30, 20, 18, 0.5), 0 0 0 1px rgba(123, 36, 51, 0.25)",
        "dark-warm-lg": "0 24px 48px rgba(11, 9, 8, 0.6), 0 0 0 1px rgba(123, 36, 51, 0.3)",
        "btn-glow": "0 0 28px rgba(201, 138, 72, 0.4), 0 6px 24px rgba(165, 91, 53, 0.35)",
        "lead-frame": "0 0 0 2px #7B2433, 0 0 40px rgba(201, 138, 72, 0.2), 0 20px 60px rgba(11, 9, 8, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
