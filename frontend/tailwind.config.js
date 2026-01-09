/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#050505',
                surface: '#121212',
                surfaceHighlight: '#1E1E1E',
                primary: '#3B82F6', // Samsung Blue-ish
                secondary: '#60A5FA',
                accent: '#8B5CF6', // AI Purple
                textMain: '#E5E5E5',
                textMuted: '#A3A3A3',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
