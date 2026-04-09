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
                    lightGreen: '#8CC63F'
                }
            }
        },
    },
    plugins: [],
}
