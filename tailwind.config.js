/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const scrollbarPlugin = require("tailwind-scrollbar");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "425px",
      xxs: "375px",
      ...defaultTheme.screens,
    },
    extend: {
      animation: {
        text: "text 5s ease infinite",
      },
      keyframes: {
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      boxShadow: {
        menu: "0 0 10px 0px rgba(255, 107, 0, 0.1)",
        light: "0 2px 10px 2px rgba(0, 0, 0, 0.1)",
        button: "0 0px 5px 0.5px rgba(0, 0, 0, 0.1)",
      },
      textColor: {
        "gray-500": "#6c757d",
      },
      fontWeight: {
        bold: "700",
      },
      padding: {
        nav: "5.3rem",
      },
      colors: {
        primary: "#141519",
        secondary: "#232329",
        action: "#FF7F57",
        image: "#3B3C41",
        txt: "#dbdcdd",
        tersier: "#0c0d10",
      },
    },
    fontFamily: {
      rama: ["Ramabhadra", "sans-serif"],
      outfit: ["Outfit", "sans-serif"],
      karla: ["Karla", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
  },
  variants: {
    extend: {
      display: ["group-focus"],
      opacity: ["group-focus"],
      inset: ["group-focus"],
      backgroundImage: ["dark"],
    },
    textColor: ["responsive", "hover", "focus"],
    fontWeight: ["responsive", "hover", "focus"],
    scrollbar: ["rounded"],
  },
  plugins: [
    scrollbarPlugin({
      nocompatible: true,
    }),
    require("tailwind-scrollbar-hide"),
  ],
};
