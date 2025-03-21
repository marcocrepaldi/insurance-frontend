"use client";

import { useEffect, useState } from "react";
import { themes } from "@/lib/theme-config";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const [selectedTheme, setSelectedTheme] = useState("");

  useEffect(() => {
    const storedTheme = localStorage.getItem("user-theme") || "theme-sapphire";
    setSelectedTheme(storedTheme);
    document.documentElement.className = storedTheme;
  }, []);

  const changeTheme = (themeClass: string) => {
    setSelectedTheme(themeClass);
    document.documentElement.className = themeClass;
    localStorage.setItem("user-theme", themeClass);
  };

  return (
    <div className="flex gap-2">
      {themes.map((theme) => (
        <Button
          key={theme.name}
          className={`w-8 h-8 rounded-full border-2 ${
            selectedTheme === theme.class ? "border-white" : "border-transparent"
          }`}
          style={{ backgroundColor: theme.color }}
          onClick={() => changeTheme(theme.class)}
        />
      ))}
    </div>
  );
}
