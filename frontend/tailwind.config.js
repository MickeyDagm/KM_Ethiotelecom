/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ethio: {
                    green: '#00A650',
                    lightGreen: '#8CC63F',
                    darkGreen: '#007A30',
                    blue: '#004B87',
                    darkBlue: '#003A6A',
                    gold: '#F5A623',
                }
            }
        },
    },
    plugins: [],
}
