'use client';

import '@/globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="flex flex-1 flex-col p-4">{children}</main>
    </ThemeProvider>
  );
}
