/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        papel: "#F4ECE0",
        papel2: "#EADFCC",
        tinta: "#1C1511",
        noite: "#17110E",
        ferrugem: "#A63A1F",
        tijolo: "#7E2713",
        sol: "#F0B429",
        ceu: "#A9C6EA",
      },
      fontFamily: {
        glitch: ['"Rubik Glitch"', "system-ui", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Instrument Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      maxWidth: { site: "1180px" },
    },
  },
  plugins: [],
};
