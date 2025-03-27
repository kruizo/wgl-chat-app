/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Ensures Tailwind listens only to <html class="dark">
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
      },
    },
  },
  plugins: [],
};
