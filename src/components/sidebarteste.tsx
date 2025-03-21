'use client';

import Link from 'next/link';

export default function SidebarComponent() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-gray-200 flex flex-col p-4">
      <div className="mb-8 text-xl font-bold">Menu</div>
      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="hover:bg-gray-700 px-2 py-1 rounded"
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className="hover:bg-gray-700 px-2 py-1 rounded"
        >
          Perfil
        </Link>
        <Link
          href="/settings"
          className="hover:bg-gray-700 px-2 py-1 rounded"
        >
          Configurações
        </Link>
      </nav>
    </aside>
  );
}
