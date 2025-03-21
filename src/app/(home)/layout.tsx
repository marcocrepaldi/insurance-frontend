export default function HomeLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <main className="min-h-screen bg-white text-black">
        {children}
      </main>
    );
  }
  