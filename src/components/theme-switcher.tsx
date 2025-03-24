"use client"

import { useEffect, useState } from "react"
import { themes } from "@/lib/theme-config"
import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const [selectedTheme, setSelectedTheme] = useState("")

  useEffect(() => {
    const storedTheme = localStorage.getItem("user-theme") || "theme-sapphire"
    applyTheme(storedTheme)
  }, [])

  const applyTheme = (themeClass: string) => {
    setSelectedTheme(themeClass)
    document.documentElement.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) {
        document.documentElement.classList.remove(cls)
      }
    })
    document.documentElement.classList.add(themeClass)
    localStorage.setItem("user-theme", themeClass)
  }

  return (
    <div className="fixed right-2 top-1/2 z-50 -translate-y-1/2 flex flex-col gap-2 bg-background/90 p-2 rounded-xl shadow-lg border">
      {themes.map((theme) => (
        <Button
          key={theme.name}
          aria-label={`Tema ${theme.name}`}
          className={`w-8 h-8 rounded-full border-2 transition-all ${
            selectedTheme === theme.class
              ? "border-foreground scale-110"
              : "border-transparent"
          }`}
          style={{ backgroundColor: theme.color }}
          onClick={() => applyTheme(theme.class)}
        />
      ))}
    </div>
  )
}
