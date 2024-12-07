'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`text-gray-900 hover:text-blue-600 ${
                pathname === '/' ? 'text-blue-600' : ''
              }`}
            >
              首页
            </Link>
            <Link
              href="/albums"
              className={`text-gray-900 hover:text-blue-600 ${
                pathname.startsWith('/albums') ? 'text-blue-600' : ''
              }`}
            >
              相册
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              {session.user?.email}
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm text-red-600 hover:text-red-700"
            >
              退出
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
