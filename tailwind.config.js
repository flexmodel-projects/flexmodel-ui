/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        "border-gray": "#dee2e6",
      },
      fontFamily: {
        'mono': [
          'JetBrains Mono',
          'Fira Code',
          'Source Code Pro',
          'Consolas',
          'Monaco',
          'Menlo',
          'Ubuntu Mono',
          'DejaVu Sans Mono',
          'monospace'
        ],
        'code': [
          'JetBrains Mono',
          'Fira Code',
          'Source Code Pro',
          'Consolas',
          'Monaco',
          'Menlo',
          'Ubuntu Mono',
          'DejaVu Sans Mono',
          'monospace'
        ],
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
