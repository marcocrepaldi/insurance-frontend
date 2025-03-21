'use client';

import { usePathname } from 'next/navigation';
import '@/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/' || pathname === '/login';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            {hideNavbar ? (
              <main className="flex flex-1 flex-col p-4">{children}</main>
            ) : (
              <>
                <AppSidebar variant="inset" />
                <SidebarInset>
                  <SiteHeader />
                  <main className="flex flex-1 flex-col p-4">{children}</main>
                </SidebarInset>
              </>
            )}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
