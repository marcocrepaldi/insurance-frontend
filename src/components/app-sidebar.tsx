"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  Building2Icon,
  FileTextIcon,
  FileSearchIcon,
  ShieldCheckIcon,
  ShieldHalfIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Harper",
    email: "admin@harper.com",
    avatar: "/avatars/default.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Clientes",
      url: "/client",
      icon: ListIcon,
    },
    {
      title: "Produtores",
      url: "/producers",
      icon: BarChartIcon,
    },
    {
      title: "Seguradoras",
      url: "/insurers",
      icon: Building2Icon,
    },
    {
      title: "Apólices",
      url: "/policies",
      icon: FileTextIcon,
    },
    {
      title: "Sinistros",
      url: "/claims",
      icon: ShieldHalfIcon,
    },
    {
      title: "Cotações",
      url: "/quotes",
      icon: FileSearchIcon,
    },
  ],

  navSecondary: [
    {
      title: "Usuários",
      url: "/users",
      icon: UsersIcon,
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Personalização",
      url: "/customize",
      icon: ClipboardListIcon,
    },
    {
      title: "Ajuda",
      url: "/help",
      icon: HelpCircleIcon,
    },
    {
      title: "Pesquisar",
      url: "/search",
      icon: SearchIcon,
    },
  ],

  documents: [
    {
      name: "Biblioteca de Dados",
      url: "/data-library",
      icon: DatabaseIcon,
    },
    {
      name: "Relatórios",
      url: "/reports",
      icon: FileIcon,
    },
    {
      name: "Assistente de Documentos",
      url: "/doc-assistant",
      icon: ShieldCheckIcon,
    },
  ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className={`transition-all ${isCollapsed ? "w-[60px]" : "w-[260px]"}`}
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowUpCircleIcon className="h-5 w-5" />
                {!isCollapsed && <span className="text-base font-semibold">Harper System</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <button
          onClick={toggleSidebar}
          className="mt-4 p-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? "Expandir" : "Colapsar"}
        </button>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />

        <div className="pt-4">
          <NavDocuments items={data.documents} />
        </div>

        <div className="mt-auto">
          <NavSecondary items={data.navSecondary} />
        </div>
      </SidebarContent>

      <SidebarFooter className="flex flex-col gap-2">
        <ThemeToggle />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
