const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
    theme: {
        extend: {
            fontFamily: {
                cairo: ["cairo", "sans-serif"],
            },
            colors: {
                primary: {
                    DEFAULT: "#1976d2",
                    50: "#effaff",
                    100: "#daf3ff",
                    200: "#beebff",
                    300: "#91dfff",
                    400: "#5ecbfc",
                    500: "#38aff9",
                    600: "#2293ee",
                    700: "#1976d2",
                    800: "#1c63b1",
                    900: "#1c548c",
                    950: "#163355",
                },
                secondary: {
                    DEFAULT: "#d32f2f",
                    50: "#fdf3f3",
                    100: "#fde3e3",
                    200: "#fbcdcd",
                    300: "#f8a9a9",
                    400: "#f17878",
                    500: "#e74c4c",
                    600: "#d32f2f",
                    700: "#b12424",
                    800: "#932121",
                    900: "#7a2222",
                    950: "#420d0d",
                },
                accent: {
                    DEFAULT: "#fbc02d",
                    50: "#fffbeb",
                    100: "#fef3c7",
                    200: "#fde58a",
                    300: "#fcd24d",
                    400: "#fbc02d",
                    500: "#f59c0b",
                    600: "#d97506",
                    700: "#b45209",
                    800: "#923f0e",
                    900: "#78340f",
                    950: "#451a03",
                },
                "light-gray": "#F0F0F0",
                text: "#212121",
            },
        },
    },
    plugins: [flowbite.plugin()],
};
