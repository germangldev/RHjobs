module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // Asegúrate de que aquí están TODAS tus rutas
  ],
  theme: {
    extend: {
      colors: {
        primary: "#a6b08f", // oliva
        secondary: "#8c9679", // oliva más oscuro
        light: "#f7f7f5", // fondo claro
        dark: "#333333", // texto oscuro
        accent: "#f0c27b", // acento cálido
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
        mono: ["Courier New", "monospace"],
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
