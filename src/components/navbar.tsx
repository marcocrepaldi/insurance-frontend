"use client"

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    // Limpa o token JWT e outros dados de sessão, se necessário
    localStorage.removeItem("jwt_token");
    // Se houver outros tokens, remova-os também:
    // localStorage.removeItem("refresh_token");
    // Redireciona para a página de login
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full bg-card shadow-md p-4 flex items-center justify-between transition-all lg:left-[260px] lg:w-[calc(100%-260px)]">
      <Button variant="ghost" className="md:hidden">
        <Menu className="w-6 h-6" />
      </Button>
      <h1 className="text-lg font-semibold text-foreground"></h1>
      <div className="flex items-center gap-4 pr-4">
        <ThemeSwitcher />
        <ThemeToggle />
        <Button variant="outline" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </header>
  );
}
