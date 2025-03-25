'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function useInitTheme() {
  const { setTheme } = useTheme()

  useEffect(() => {
    const themeClass = localStorage.getItem('user-theme') || 'theme-sapphire'

    // Remove classes antigas e aplica o tema salvo
    document.documentElement.classList.forEach((cls) => {
      if (cls.startsWith('theme-')) {
        document.documentElement.classList.remove(cls)
      }
    })
    document.documentElement.classList.add(themeClass)

    // Aplica o modo dark/light salvo
    const savedMode = localStorage.getItem('mode')
    if (savedMode === 'dark' || savedMode === 'light') {
      setTheme(savedMode)
    }
  }, [setTheme])
}
