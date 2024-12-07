'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-900 hover:text-blue-600">
              <Logo size={32} className="text-blue-600" />
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  pathname === '/' ? 'text-blue-600' : ''
                }`}
              >
                我的空间
              </Link>
              <Link
                href="/albums"
                className={`text-gray-600 hover:text-blue-600 transition-colors ${
                  pathname.startsWith('/albums') ? 'text-blue-600' : ''
                }`}
              >
                相册集
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-600">
              {session.user?.email}
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              退出
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
