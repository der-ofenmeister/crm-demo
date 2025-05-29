/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
        "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
        // if you keep pages under /src/pages instead of /src/app, add:
        // './src/pages/**/*.{js,jsx,ts,tsx,mdx}',
    ],
    theme: { extend: {} },
    plugins: [],
};
