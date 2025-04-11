import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "fade-slide-up": {
          "0%": { transform: "translateY(10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 4s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "scale-in": "scale-in 0.3s ease-out",
        "fade-slide-up": "fade-slide-up 0.4s ease-out",
      },
      boxShadow: {
        "neumorphic-sm":
          "5px 5px 10px rgba(195, 195, 195, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.9)",
        neumorphic:
          "10px 10px 20px rgba(195, 195, 195, 0.5), -10px -10px 20px rgba(255, 255, 255, 0.9)",
        "neumorphic-lg":
          "15px 15px 30px rgba(195, 195, 195, 0.5), -15px -15px 30px rgba(255, 255, 255, 0.9)",
        "neumorphic-inset-sm":
          "inset 3px 3px 6px rgba(195, 195, 195, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.9)",
        "neumorphic-inset":
          "inset 5px 5px 10px rgba(195, 195, 195, 0.5), inset -5px -5px 10px rgba(255, 255, 255, 0.9)",
      },
      transitionProperty: {
        shadow: "box-shadow",
        filter: "filter",
        "transform-shadow": "transform, box-shadow",
      },
      backgroundImage: {
        "gradient-soft":
          "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 245, 0.8))",
        "gradient-surface": "linear-gradient(145deg, #f8f8fa, #f2f2f4)",
        "gradient-inset": "linear-gradient(145deg, #f2f2f4, #f8f8fa)",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    function ({ addUtilities }) {
      const newUtilities = {
        ".neumorphic-press": {
          transform: "scale(0.98)",
          boxShadow:
            "inset 3px 3px 6px rgba(195, 195, 195, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.9)",
          background: "linear-gradient(145deg, #f2f2f4, #f8f8fa)",
        },
        ".text-shadow-sm": {
          textShadow:
            "1px 1px 1px rgba(255, 255, 255, 0.9), -1px -1px 1px rgba(195, 195, 195, 0.5)",
        },
        ".backdrop-blur-neumorphic": {
          backdropFilter: "blur(8px)",
          background:
            "linear-gradient(145deg, rgba(248, 248, 250, 0.85), rgba(242, 242, 244, 0.85))",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
