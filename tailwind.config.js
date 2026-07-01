/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          '2xl': '1400px'
        }
      },
      extend: {
        fontFamily: {
          sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          display: ['var(--font-grotesk)', 'var(--font-inter)', 'sans-serif'],
        },
        colors: {
          brand: {
            DEFAULT: '#5B8CFF',
            50: '#EEF3FF',
            100: '#DCE6FF',
            200: '#BBCEFF',
            300: '#93AEFF',
            400: '#6E93FF',
            500: '#5B8CFF',
            600: '#3E63F5',
            700: '#2F48D6',
            800: '#293CAB',
            900: '#243685',
          },
          ink: {
            DEFAULT: '#08080A',
            50: '#F5F5F6',
            900: '#08080A',
            950: '#050506',
          },
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))'
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))'
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))'
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))'
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))'
          },
          popover: {
            DEFAULT: 'hsl(var(--popover))',
            foreground: 'hsl(var(--popover-foreground))'
          },
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))'
          }
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)'
        },
        keyframes: {
          'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
          'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
          marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
          'marquee-reverse': { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
          float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
          aurora: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(6%,-8%) scale(1.15)' }, '66%': { transform: 'translate(-6%,6%) scale(0.9)' } },
          shimmer: { '100%': { transform: 'translateX(200%)' } },
          'spin-slow': { to: { transform: 'rotate(360deg)' } },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          marquee: 'marquee var(--marquee-duration,40s) linear infinite',
          'marquee-reverse': 'marquee-reverse var(--marquee-duration,40s) linear infinite',
          float: 'float 7s ease-in-out infinite',
          aurora: 'aurora 18s ease-in-out infinite',
          'spin-slow': 'spin-slow 22s linear infinite',
        }
      }
    },
    plugins: [require("tailwindcss-animate")],
  }
