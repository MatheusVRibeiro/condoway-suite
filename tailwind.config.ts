import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				// Base semantic colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--condoway-primary-hover))',
					light: 'hsl(var(--condoway-primary-light))'
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
				},
				// CondoWay specific colors
				condoway: {
					primary: 'hsl(var(--condoway-primary))',
					'primary-hover': 'hsl(var(--condoway-primary-hover))',
					'primary-light': 'hsl(var(--condoway-primary-light))',
					success: 'hsl(var(--condoway-success))',
					'success-light': 'hsl(var(--condoway-success-light))',
					error: 'hsl(var(--condoway-error))',
					'error-light': 'hsl(var(--condoway-error-light))',
					warning: 'hsl(var(--condoway-warning))',
					'warning-light': 'hsl(var(--condoway-warning-light))',
					info: 'hsl(var(--condoway-info))',
					'info-light': 'hsl(var(--condoway-info-light))',
					text: {
						primary: 'hsl(var(--condoway-text-primary))',
						secondary: 'hsl(var(--condoway-text-secondary))',
						muted: 'hsl(var(--condoway-text-muted))'
					},
					border: 'hsl(var(--condoway-border))',
					'border-light': 'hsl(var(--condoway-border-light))'
				}
			},
			boxShadow: {
				'condoway-sm': 'var(--shadow-sm)',
				'condoway-md': 'var(--shadow-md)',
				'condoway-lg': 'var(--shadow-lg)',
				'condoway-xl': 'var(--shadow-xl)'
			},
			animation: {
				'slide-in': 'slideIn 0.3s ease-out',
				'fade-in': 'fadeIn 0.3s ease-out',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			keyframes: {
				slideIn: {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
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
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
