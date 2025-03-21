'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
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
          {hideSidebarNavbar ? (
            <div className="flex flex-col w-full">
              <SiteHeader />
              <Navbar />
              {children}
            </div>
          ) : (
            <SidebarProvider>
              <AppSidebar variant="inset" />
              <SidebarInset>
                <Navbar />
                <SiteHeader />
                <main className="flex flex-1 flex-col p-4">{children}</main>
              </SidebarInset>
            </SidebarProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
