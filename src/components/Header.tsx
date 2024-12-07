'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b fixed w-full top-0 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900">图库</span>
          </Link>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                退出
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
