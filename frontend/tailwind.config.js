/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                "ink-free": ['"Ink Free"', "cursive"],
                "inria-sans": ['"Inria Sans"', "sans-serif"],
            },
            colors: {
                secondary: "#960057",
            },
        },
    },
        darkMode: 'class',  
        plugins: [],
    };
