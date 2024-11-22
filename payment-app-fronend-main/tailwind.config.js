module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all relevant paths are included
    "./public/index.html",
  ],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          "0%, 100%": { transform: "scale(0.8)", opacity: "0.8" },
          "50%": { transform: "scale(1)", opacity: "1" },
        },
        drawTick: {
          "0%": { strokeDasharray: "0 24" },
          "100%": { strokeDasharray: "24 24" },
        },
      },
      animation: {
        "pulse-tick": "pulse 1.5s infinite",
        "draw-tick": "drawTick 0.8s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};