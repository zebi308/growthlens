/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-sans)', 'sans-serif'],
  			display: ['var(--font-display)', 'sans-serif']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  safelist: [
    'bg-blue-100', 'text-blue-700', 'bg-sky-100', 'text-sky-700',
    'bg-pink-100', 'text-pink-700', 'bg-purple-100', 'text-purple-700',
    'bg-red-100', 'text-red-700', 'bg-amber-100', 'text-amber-700',
    'bg-emerald-100', 'text-emerald-700',
    'bg-blue-900/30', 'text-blue-400', 'bg-sky-900/30', 'text-sky-400',
    'bg-pink-900/30', 'text-pink-400', 'bg-purple-900/30', 'text-purple-400',
    'bg-red-900/30', 'text-red-400', 'bg-amber-900/30', 'text-amber-400',
    'bg-emerald-900/30', 'text-emerald-400',
    'bg-emerald-500/10', 'text-emerald-600', 'bg-blue-500/10', 'text-blue-600',
    'text-emerald-500', 'text-blue-500', 'text-amber-500', 'text-orange-500', 'text-red-500',
    'text-emerald-400', 'text-blue-400', 'text-amber-400', 'text-orange-400', 'text-red-400',
    'from-emerald-500/20', 'to-emerald-500/5', 'from-blue-500/20', 'to-blue-500/5',
    'from-amber-500/20', 'to-amber-500/5', 'from-orange-500/20', 'to-orange-500/5',
    'from-red-500/20', 'to-red-500/5',
    'from-violet-500/20', 'to-violet-500/5', 'from-pink-500/20', 'to-pink-500/5',
  ],
  plugins: [require("tailwindcss-animate")],
}