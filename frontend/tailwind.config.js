/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Refined color palette - more sophisticated, less saturated
                background: "hsl(220, 20%, 4%)",
                foreground: "hsl(0, 0%, 95%)",
                card: {
                    DEFAULT: "hsl(220, 20%, 7%)",
                    foreground: "hsl(0, 0%, 95%)",
                },
                popover: {
                    DEFAULT: "hsl(220, 20%, 7%)",
                    foreground: "hsl(0, 0%, 95%)",
                },
                primary: {
                    DEFAULT: "hsl(210, 100%, 52%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                secondary: {
                    DEFAULT: "hsl(262, 60%, 55%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                muted: {
                    DEFAULT: "hsl(220, 15%, 12%)",
                    foreground: "hsl(220, 10%, 55%)",
                },
                accent: {
                    DEFAULT: "hsl(262, 50%, 48%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                destructive: {
                    DEFAULT: "hsl(0, 65%, 50%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                success: {
                    DEFAULT: "hsl(152, 65%, 42%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                warning: {
                    DEFAULT: "hsl(38, 92%, 50%)",
                    foreground: "hsl(0, 0%, 0%)",
                },
                border: "hsl(220, 15%, 16%)",
                input: "hsl(220, 15%, 16%)",
                ring: "hsl(210, 100%, 52%)",
            },
            borderRadius: {
                xl: "1rem",
                lg: "0.75rem",
                md: "0.5rem",
                sm: "0.375rem",
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                mono: ['SF Mono', 'JetBrains Mono', 'Consolas', 'monospace'],
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],
                'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
                '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
                '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
                '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
            },
            boxShadow: {
                'glow': '0 0 60px -10px hsl(210, 100%, 52%, 0.25)',
                'glow-sm': '0 0 30px -5px hsl(210, 100%, 52%, 0.2)',
                'glow-purple': '0 0 60px -10px hsl(262, 60%, 55%, 0.25)',
                'card': '0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.25)',
                'card-hover': '0 4px 6px rgba(0, 0, 0, 0.35), 0 8px 30px rgba(0, 0, 0, 0.3)',
            },
            animation: {
                'float': 'float 8s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-8px) rotate(1deg)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.3' },
                    '50%': { opacity: '0.6' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
        },
    },
    plugins: [],
}
