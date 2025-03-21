export default function HomeLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-background text-foreground">
          {/* Layout simples sem Navbar e Sidebar */}
          {children}
        </body>
      </html>
    );
  }
  