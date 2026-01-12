/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "hsl(222, 47%, 6%)",
                foreground: "hsl(210, 40%, 98%)",
                card: {
                    DEFAULT: "hsl(222, 47%, 8%)",
                    foreground: "hsl(210, 40%, 98%)",
                },
                popover: {
                    DEFAULT: "hsl(222, 47%, 8%)",
                    foreground: "hsl(210, 40%, 98%)",
                },
                primary: {
                    DEFAULT: "hsl(217, 91%, 60%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                secondary: {
                    DEFAULT: "hsl(270, 70%, 60%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                muted: {
                    DEFAULT: "hsl(222, 47%, 15%)",
                    foreground: "hsl(215, 20%, 65%)",
                },
                accent: {
                    DEFAULT: "hsl(270, 70%, 50%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                destructive: {
                    DEFAULT: "hsl(0, 72%, 51%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                success: {
                    DEFAULT: "hsl(142, 76%, 36%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                border: "hsl(222, 47%, 18%)",
                input: "hsl(222, 47%, 18%)",
                ring: "hsl(217, 91%, 60%)",
            },
            borderRadius: {
                lg: "0.75rem",
                md: "0.5rem",
                sm: "0.25rem",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'glow': '0 0 40px hsl(217, 91%, 60%, 0.3)',
                'glow-sm': '0 0 20px hsl(217, 91%, 60%, 0.2)',
                'glow-purple': '0 0 40px hsl(270, 70%, 50%, 0.3)',
                'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '0.8' },
                },
            },
        },
    },
    plugins: [],
}
