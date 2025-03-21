'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-gray-800 text-white flex items-center px-4 justify-between">
      <div className="text-lg font-bold">Minha Aplicação</div>
      <ul className="flex gap-4">
        <li>
          <Link href="/" className="hover:text-gray-400">
            Home
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className="hover:text-gray-400">
            Dashboard
          </Link>
        </li>
        <li>
          <button className="hover:text-gray-400">
            Dark Mode
          </button>
        </li>
      </ul>
    </nav>
  );
}
