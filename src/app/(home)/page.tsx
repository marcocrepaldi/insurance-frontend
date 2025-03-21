import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Landing Page</h1>
      <p>Bem-vindo ao nosso sistemmma.</p>
      <Link href="/login" className="px-4 py-2 bg-gray-900 text-white rounded">
        Acessar Plataforma
      </Link>
    </main>
  );
}
