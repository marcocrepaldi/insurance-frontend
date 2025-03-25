'use client'

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Usuários',
  '/settings': 'Configurações',
  '/documents': 'Documentos',
  '/client': 'Clientes',
  
  // Adicione outras rotas conforme sua necessidade
}

export function SiteHeader() {
  const pathname = usePathname()

  // Define um título padrão caso a URL não seja encontrada no objeto
  const title = pageTitles[pathname] || 'Página'

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
