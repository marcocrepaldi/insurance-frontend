'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/' || pathname === '/login'

  return (
    <SidebarProvider>
      <Toaster />
      {isAuthPage ? (
        <main className="flex flex-1 flex-col p-4">{children}</main>
      ) : (
        <>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <div className="relative z-40 mt-16">
              <SiteHeader />
            </div>
            <main className="flex flex-1 flex-col px-4 pt-4">
              {children}
            </main>
          </SidebarInset>
        </>
      )}
    </SidebarProvider>
  )
}
