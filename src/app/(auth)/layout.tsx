'use client';

import '@/globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import { SiteHeader } from '@/components/site-header'; // ✅ Correto

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col w-full">
            <Navbar />
            <SiteHeader />
            <main className="flex flex-1 flex-col p-4">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
