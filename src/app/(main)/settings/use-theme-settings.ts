'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type Color =
  | 'zinc'
  | 'red'
  | 'rose'
  | 'orange'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'violet'
type Radius = '0' | '0.3' | '0.5' | '0.75' | '1.0'

export const themePresets: Record<string, { primary: string; foreground: string }> = {
  Corporate: {
    primary: '220 60% 50%',
    foreground: '0 0% 100%',
  },
  Ocean: {
    primary: '190 80% 40%',
    foreground: '0 0% 100%',
  },
  Watermelon: {
    primary: '350 80% 65%',
    foreground: '0 0% 100%',
  },
  Neon: {
    primary: '130 100% 50%',
    foreground: '0 0% 10%',
  },
  Mocha: {
    primary: '25 30% 40%',
    foreground: '0 0% 100%',
  },
  Midnight: {
    primary: '260 70% 50%',
    foreground: '0 0% 100%',
  },
}

export function useThemeSettings() {
  const [theme, setTheme] = useState<Theme>('light')
  const [color, setColor] = useState<Color>('green')
  const [radius, setRadius] = useState<Radius>('0.75')

  const applyVariables = (primary: string, foreground: string) => {
    // Aplica no <html>
    document.documentElement.style.setProperty('--primary', primary)
    document.documentElement.style.setProperty('--ring', primary)
    document.documentElement.style.setProperty('--primary-foreground', foreground)

    // Aplica no :root também
    const root = document.querySelector(':root') as HTMLElement
    if (root) {
      root.style.setProperty('--primary', primary)
      root.style.setProperty('--ring', primary)
      root.style.setProperty('--primary-foreground', foreground)
    }
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme
    const storedColor = localStorage.getItem('color') as Color
    const storedRadius = localStorage.getItem('radius') as Radius
    const storedCustomTheme = localStorage.getItem('custom-theme')

    if (storedTheme) setTheme(storedTheme)
    if (storedColor) setColor(storedColor)
    if (storedRadius) setRadius(storedRadius)

    if (storedCustomTheme) {
      const custom = JSON.parse(storedCustomTheme)
      applyVariables(custom.primary, custom.foreground)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('color', color)
    const colors: Record<Color, { primary: string; foreground: string }> = {
      zinc: { primary: '240 5% 20%', foreground: '0 0% 100%' },
      red: { primary: '0 84.2% 60.2%', foreground: '0 0% 100%' },
      rose: { primary: '340 80% 65%', foreground: '0 0% 100%' },
      orange: { primary: '24 94% 50%', foreground: '0 0% 100%' },
      green: { primary: '142.1 76.2% 36.3%', foreground: '0 0% 100%' },
      blue: { primary: '221 83% 53%', foreground: '0 0% 100%' },
      yellow: { primary: '47.9 95.8% 53.1%', foreground: '0 0% 20%' },
      violet: { primary: '262 83% 58%', foreground: '0 0% 100%' },
    }

    const selected = colors[color]
    applyVariables(selected.primary, selected.foreground)

    // Remove tema customizado se usar cor manual
    localStorage.removeItem('custom-theme')
  }, [color])

  useEffect(() => {
    localStorage.setItem('radius', radius)
    document.documentElement.style.setProperty('--radius', radius + 'rem')

    const root = document.querySelector(':root') as HTMLElement
    if (root) {
      root.style.setProperty('--radius', radius + 'rem')
    }
  }, [radius])

  function applyPreset(preset: string) {
    const theme = themePresets[preset]
    if (!theme) return
    applyVariables(theme.primary, theme.foreground)
    localStorage.setItem('custom-theme', JSON.stringify(theme))
  }

  return {
    theme,
    setTheme,
    color,
    setColor,
    radius,
    setRadius,
    applyPreset,
  }
}
