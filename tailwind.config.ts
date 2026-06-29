/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta llanera fija — tomada de la sabana real, no de un souvenir.
        sabana: {
          profunda: "#2C1810",
          tierra: "#8B4513",
          paja: "#D4A843",
          verde: "#4A6741",
          cielo: "#3D7AB5",
          corocora: "#C1440E",
          ocaso: "#E8722A",
          noche: "#0D1117",
        },
        // Legacy — no eliminar (referencias en StatsPanel y ui.tsx).
        llano: {
          sky: "#1b2a4a",
          dusk: "#C1440E",
          sun: "#D4A843",
          grass: "#4A6741",
          river: "#3D7AB5",
        },
      },
      fontFamily: {
        timer: [
          '"Palatino Linotype"',
          "Palatino",
          "Georgia",
          '"Book Antiqua"',
          "serif",
        ],
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "garza-fly": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateY(-80px) rotate(-8deg)",
            opacity: "0",
          },
        },
        "garza-head": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(-18deg)" },
        },
        "float-side": {
          "0%, 100%": { transform: "translateX(0px)" },
          "50%": { transform: "translateX(8px)" },
        },
        "chiguiro-ear": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(12deg)" },
        },
        "tonina-leap": {
          "0%": {
            transform: "translateY(30px) rotate(20deg)",
            opacity: "0",
          },
          "25%": {
            transform: "translateY(-50px) rotate(-25deg)",
            opacity: "1",
          },
          "60%": {
            transform: "translateY(-20px) rotate(15deg)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(30px) rotate(20deg)",
            opacity: "0",
          },
        },
        "corocora-cross": {
          "0%": { transform: "translateX(-120px)", opacity: "1" },
          "100%": {
            transform: "translateX(calc(100vw + 120px))",
            opacity: "1",
          },
        },
        "mariposa-cross": {
          "0%": { transform: "translateX(-40px) translateY(0px)", opacity: "0" },
          "5%": { opacity: "1" },
          "50%": { transform: "translateX(50vw) translateY(-20px)" },
          "95%": { opacity: "1" },
          "100%": {
            transform: "translateX(calc(100vw + 40px)) translateY(0px)",
            opacity: "0",
          },
        },
        "celebration-rise": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "20%": { opacity: "1", transform: "translateY(0)" },
          "80%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-10px)" },
        },
        "luciernagas": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "garza-fly": "garza-fly 1.4s ease-in-out forwards",
        "garza-head": "garza-head 2s ease-in-out",
        "float-side": "float-side 4s ease-in-out infinite",
        "chiguiro-ear": "chiguiro-ear 1.5s ease-in-out",
        "tonina-leap": "tonina-leap 1.3s ease-in-out forwards",
        "corocora-cross": "corocora-cross 3.2s ease-in-out forwards",
        "mariposa-cross": "mariposa-cross 5s ease-in-out forwards",
        "celebration-rise": "celebration-rise 3s ease-in-out forwards",
        "luciernagas": "luciernagas 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
