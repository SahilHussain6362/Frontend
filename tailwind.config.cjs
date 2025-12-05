module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#0f1419",
        "dark-surface": "#1a1f2e",
        "dark-border": "#2a2f3e",
        "neon-purple": "#7c3aed",
        "neon-cyan": "#06b6d4",
        "neon-pink": "#ec4899",
        "neon-green": "#10b981",
        "neon-red": "#ef4444",
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
