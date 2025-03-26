'use client'

import { usePathname } from 'next/navigation'
import '@/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useInitTheme } from '@/lib/use-init-theme'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/' || pathname === '/login'

  useInitTheme()

  return (
    <html lang="en" className="min-h-screen" suppressHydrationWarning>
      <body className="flex min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
        </ThemeProvider>
      </body>
    </html>
  )
}
