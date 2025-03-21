import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Navbar() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center justify-between">
      <Button variant="ghost" className="md:hidden">
        <Menu className="w-6 h-6" />
      </Button>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Navbar</h1>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <ThemeToggle />
        <Button variant="outline">Sair</Button>
      </div>
    </header>
  );
}