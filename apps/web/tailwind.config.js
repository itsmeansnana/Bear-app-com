/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./styles/**/*.{css}"],
  theme: {
    extend: {
      colors: {
        bg: "#0e1116",
        card: "#161a22",
        card2: "#11151c",
        border: "#252a34",
        limey: "#c6ff00",
        muted: "#a3aab7"
      },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,.35)" }
    }
  },
  plugins: []
};
