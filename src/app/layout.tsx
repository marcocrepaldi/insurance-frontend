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
  const hideSidebarNavbar = pathname === '/' || pathname.includes('/login');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider> {/* ✅ Movido para englobar toda a estrutura */}
            {hideSidebarNavbar ? (
              <div className="flex flex-col w-full">
                <SiteHeader />
                <Navbar />
                <main className="flex-1">{children}</main>
              </div>
            ) : (
              <div className="flex flex-1">
                <AppSidebar variant="inset" /> {/* ✅ Agora está dentro do SidebarProvider */}
                <SidebarInset className="flex flex-col flex-1">
                  <Navbar />
                  <SiteHeader />
                  <main className="flex flex-1 flex-col p-4">{children}</main>
                </SidebarInset>
              </div>
            )}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
