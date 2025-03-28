'use client'

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname, useRouter } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Usuários',
  '/settings': 'Configurações',
  '/documents': 'Documentos',
  '/client': 'Clientes',
  '/producers': 'Produtores',
  '/tasks': 'Tarefas',
  '/tasks/[id]': 'Detalhes da Tarefa',
  '/tasks/[id]/history': 'Histórico da Tarefa',
  '/tasks/[id]/comments': 'Comentários da Tarefa',
  
  // Adicione outras rotas conforme sua necessidade
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()

  // Define um título padrão caso a URL não seja encontrada no objeto
  const title = pageTitles[pathname] || 'Página'

  const handleLogout = () => {
    // Limpa o token JWT e outros dados de sessão, se necessário
    localStorage.removeItem("jwt_token")
    // Redireciona para a página de login
    router.push("/login")
  }

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-auto flex shrink-0 items-center gap-2 border-b px-4 py-2 transition-[width,height] ease-linear lg:px-6">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
