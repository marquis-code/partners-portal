/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pippin: {
          dark: "#FFE5E4",
          light: "#FFE8E7",
          lighter: "#FFEAEA",
          faint: "#FFEFEF",
          fainter: "#FFFCFC"
        },
        blue: {
          dark: "#4848ED",
          light: "#5A5AEF",
          lighter: "#6D6DF1",
          faint: "#9191F4",
          fainter: "#DADAFB"
        },
        purple: {
          dark: "#A3A9EF",
          light: "#ACB2F1",
          lighter: "#B5BAF2",
          faint: "#C8CBF5",
          fainter: "#EDEEFC"
        },
        red: {
          darker: "#B01C23",
          dark: "#E13D45",
          light: "#E97278",
          lighter: "#F1A7AA",
          faint: "#F7CACC",
          fainter: "#FCEDEE"
        },
        grays: {
          black: "#000005",
          "black-2": "#09090F",
          "black-3": "#444854",
          "black-4": "#575A65",
          "black-5": "#6E717C",
          "black-6": "#B9BCC8",
          "black-7": "#D3DCE6",
          "black-8": "#E0E6ED",
          "black-9": "#E5E9F2",
          "black-10": "#EFF2F7",
          "black-11": "#F9FBFA",
          white: "#FFFFFF"
        },
        "sh-grey": {
          50: "#FAFAFA",
          100: "#F4F5F4",
          200: "#DFE0DF",
          300: "#C6C8C7",
          400: "#ACAFAE",
          500: "#8D918F",
          600: "#737876",
          700: "#595E5C",
          800: "#313533",
          900: "#101211"
        },
        'sh-green': {
          50: "#F5FFFA",
          100: "#E6FFF2",
          200: "#CCFEE4",
          300: "#91F9C4",
          400: "#5CF2A6",
          500: "#20E682",
          600: "#15CD70",
          700: "#0DAC5C",
          800: "#058344",
          900: "#006633"
        },
        'sh-purple': {
          700: "#4848ED"
        } 
      }
    }
  },
  plugins: []
};
