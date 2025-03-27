import '@/globals.css'
import { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { AppShell } from '@/components/app-shell'

export const metadata: Metadata = {
  title: 'Insurance App',
  description: 'Sistema de Seguros',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
