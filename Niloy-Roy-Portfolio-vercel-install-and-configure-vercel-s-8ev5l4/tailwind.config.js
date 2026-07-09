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
    future: {
      // avoids sticky :hover states on iOS / touch devices
      hoverOnlyWhenSupported: true,
    },
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
          sans: ['var(--font-inter)', '-apple-system', 'SF Pro Display', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          display: ['var(--font-inter)', '-apple-system', 'SF Pro Display', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          graffiti: ['var(--font-graffiti)', 'var(--font-grotesk)', 'cursive'],
        },
        colors: {
          brand: {
            DEFAULT: '#6D8DFF',
            50: '#F0F4FF',
            100: '#E0E9FF',
            200: '#C2D2FF',
            300: '#9DB6FF',
            400: '#82A0FF',
            500: '#6D8DFF',
            600: '#4E6DF0',
            700: '#3B52D0',
            800: '#3242A4',
            900: '#2B3880',
          },
          violet2: {
            DEFAULT: '#A78BFA',
            300: '#C3B5FF',
            400: '#B39DFC',
            500: '#A78BFA',
            600: '#8B67F5',
          },
          fg: 'hsl(var(--fg) / <alpha-value>)',
          base: 'hsl(var(--base) / <alpha-value>)',
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
          sm: 'calc(var(--radius) - 4px)',
          '4xl': '2rem',
          '5xl': '2.5rem',
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
          'pulse-soft': { '0%,100%': { opacity: '0.7' }, '50%': { opacity: '1' } },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          marquee: 'marquee var(--marquee-duration,40s) linear infinite',
          'marquee-reverse': 'marquee-reverse var(--marquee-duration,40s) linear infinite',
          float: 'float 7s ease-in-out infinite',
          aurora: 'aurora 18s ease-in-out infinite',
          'spin-slow': 'spin-slow 22s linear infinite',
          'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        }
      }
    },
    plugins: [require("tailwindcss-animate")],
  }
