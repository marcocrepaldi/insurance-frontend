'use client';

import { usePathname } from 'next/navigation';
import '@/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Navbar from '@/components/navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/' || pathname === '/login';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            {isAuthPage ? (
              <main className="flex flex-1 flex-col p-4">{children}</main>
            ) : (
              <>
                <AppSidebar variant="inset" />
                <SidebarInset>
                  <Navbar />
                  {/* SiteHeader fora da pilha da Navbar, com espaço próprio */}
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
  );
}
