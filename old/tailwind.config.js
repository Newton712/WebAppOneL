/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Assure-toi que ce fichier HTML est bien inclus
    "./src/**/*.{js,jsx,ts,tsx}", // Inclut tous les fichiers JS/JSX/TS/TXS dans src
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#1e1e1e',
        'custom-dark': '#121212',
      },
    },
  },
  plugins: [],
}