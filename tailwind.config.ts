import type { Config } from 'tailwindcss'

type OpacityFnParams = {
  opacityVariable?: string
  opacityValue?: string
}

const withOpacity = (variableName: string) => ({ opacityVariable, opacityValue }: OpacityFnParams) => {
  if (opacityValue !== undefined) {
    return `hsl(var(${variableName}) / ${opacityValue})`
  }
  return `hsl(var(${variableName}) / var(${opacityVariable}, 1))`
}

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: withOpacity('--primary'),
        'primary-foreground': withOpacity('--primary-foreground'),
        ring: withOpacity('--ring'),
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        muted: withOpacity('--muted'),
        'muted-foreground': withOpacity('--muted-foreground'),
        accent: withOpacity('--accent'),
        'accent-foreground': withOpacity('--accent-foreground'),
        destructive: withOpacity('--destructive'),
        'destructive-foreground': withOpacity('--destructive-foreground'),
        border: withOpacity('--border'),
        input: withOpacity('--input'),
        card: withOpacity('--card'),
        'card-foreground': withOpacity('--card-foreground'),
        popover: withOpacity('--popover'),
        'popover-foreground': withOpacity('--popover-foreground'),
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}

export default config
