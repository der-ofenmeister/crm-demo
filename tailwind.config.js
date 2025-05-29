/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
        "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
        "./src/pages/**/*.{js,jsx,ts,tsx,mdx}",
        // Add any other directories where you use Tailwind classes
    ],
    theme: { 
        extend: {} 
    },
    plugins: [],
};