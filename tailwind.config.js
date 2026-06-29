/** @type {import('tailwindcss').Config} */
export default {
  // Clase 'dark' controlada por la app (tema claro/oscuro/sistema).
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta inspirada en el atardecer llanero (cielo, tierra, fauna).
        llano: {
          sky: "#1b2a4a",
          dusk: "#e07a3f",
          sun: "#f4b860",
          grass: "#3f7d4f",
          river: "#2f7a8c",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
