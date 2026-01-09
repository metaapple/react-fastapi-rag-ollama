/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#EFF6FF', // Blue 50 Base
                surface: '#FFFFFF',
                surfaceHighlight: '#F1F5F9',
                primary: '#3B82F6', // Samsung Blue-ish
                secondary: '#60A5FA',
                accent: '#8B5CF6', // AI Purple
                textMain: '#0F172A',
                textMuted: '#64748B',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float-slow': 'float-slow 20s infinite ease-in-out',
                'float-medium': 'float-medium 15s infinite ease-in-out',
                'float-fast': 'float-fast 10s infinite ease-in-out',
                'roam-1': 'roam-1 25s infinite linear',
                'roam-2': 'roam-2 28s infinite linear',
                'roam-3': 'roam-3 30s infinite linear',
            },
            keyframes: {
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0) translateX(0)' },
                    '50%': { transform: 'translateY(-20px) translateX(10px)' },
                },
                'float-medium': {
                    '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-30px) translateX(-20px) rotate(5deg)' },
                },
                'float-fast': {
                    '0%, 100%': { transform: 'translateY(0) translateX(0)' },
                    '50%': { transform: 'translateY(-10px) translateX(20px)' },
                },
                'roam-1': {
                    '0%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(30vw, -10vh) scale(1.1)' },
                    '66%': { transform: 'translate(-20vw, 20vh) scale(0.9)' },
                    '100%': { transform: 'translate(0, 0) scale(1)' },
                },
                'roam-2': {
                    '0%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '25%': { transform: 'translate(-20vw, 15vh) rotate(90deg)' },
                    '50%': { transform: 'translate(20vw, -10vh) rotate(180deg)' },
                    '75%': { transform: 'translate(10vw, 10vh) rotate(270deg)' },
                    '100%': { transform: 'translate(0, 0) rotate(360deg)' },
                },
                'roam-3': {
                    '0%': { transform: 'translate(0, 0)' },
                    '50%': { transform: 'translate(40vw, 30vh)' },
                    '100%': { transform: 'translate(0, 0)' },
                }
            }
        },
    },
    plugins: [],
}
