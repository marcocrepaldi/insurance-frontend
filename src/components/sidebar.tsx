import { Home, User, Settings, LineChart, Package, ShoppingCart, LogOut } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Perfil", href: "/profile", icon: User },
  { name: "Relatórios", href: "/reports", icon: LineChart },
  { name: "Produtos", href: "/products", icon: Package },
  { name: "Vendas", href: "/sales", icon: ShoppingCart },
  { name: "Configurações", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-background text-foreground p-5 border-r">
      <h2 className="text-xl font-bold mb-6">Minha Empresa</h2>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition"
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <button className="flex items-center gap-3 p-3 w-full text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition">
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
