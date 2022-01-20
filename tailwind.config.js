module.exports = {
  purge: [
    "./src/**/*.html",
    "./src/**/*.js",
    "./src/*.js",
    "./src/*.html"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        grey: {
          50: "#F7F7F7",
          100: "#E1E1E1",
          200: "#CFCFCF",
          300: "#B1B1B1",
          400: "#9E9E9E",
          500: "#7E7E7E",
          600: "#626262",
          700: "#515151",
          800: "#3B3B3B",
          900: "#222222"
        },
        teal: {
          50: "#F0FCF9",
          100: "#C6F7E9",
          200: "#8EEDD1",
          300: "#5FE3C0",
          400: "#2DCCA7",
          500: "#17B897",
          600: "#079A82",
          700: "#048271",
          800: "#016457",
          900: "#004440"
        },
        red: {
          50: "#FFE3E3",
          100: "#FFBDBD",
          200: "#FF9B9B",
          300: "#F86A6A",
          400: "#EF4E4E",
          500: "#E12D39",
          600: "#CF1124",
          700: "#AB091E",
          800: "#8A041A",
          900: "#610316"
        }
      },
      boxShadow: {
        "offset-purple": "4px 4px rgba(167, 139, 250, 1)"
      }
    },
    fontFamily: {
      sans: ["Inconsolata"]
    }
  },
  variants: {
    extend: {
      translate: ['group-hover'],
    },
  },
  plugins: [],
}