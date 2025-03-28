const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true,
  plugins: [],
  theme: {
    colors: {
      black: colors.black,
      error: colors.red[500],
      gray: {
        200: "rgba(0, 0, 0, 0.23)", // Border color
        600: "rgba(0, 0, 0, 0.60)", // Typography color="textSecondary"
      },
      info: colors.blue[500],
      paper: {
        100: "rgba(0, 0, 0, 0.03)",
        200: "rgba(0, 0, 0, 0.04)",
      },
      primary: {
        main: "var(--color-primary-main)",
      },
      secondary: {
        main: "var(--color-secondary-main)",
      },
      success: colors.green[500],
      warning: colors.orange[500],
      white: colors.white,
    },
    extend: {
      boxShadow: {
        md: "0px 0px 8px rgba(0, 0, 0, 0.1)",
        sm: "0px 0px 4px rgba(0, 0, 0, 0.1)",
      },
    },
    screens: {
      lg: "1200px",
      md: "900px",
      sm: "600px",
      xl: "1600px",
    },
  },
}
