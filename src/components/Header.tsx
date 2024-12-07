'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b fixed w-full top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size={32} className="text-blue-600" />
            <span className="text-xl font-medium text-gray-900">流光</span>
          </Link>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-6">
          {session ? (
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                退出
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
