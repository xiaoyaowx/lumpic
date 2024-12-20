'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const navigation = [
  {
    name: '我的空间',
    href: '/',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: '相册集',
    href: '/albums',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <nav className="pt-5 space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className={isActive ? 'text-blue-700' : 'text-gray-500'}>
              {item.icon}
            </span>
            <span className="ml-3">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* 移动端菜单按钮和菜单 */}
      {isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* 菜单按钮 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>
          
          {/* 菜单内容 */}
          {isMobileMenuOpen && (
            <aside className="fixed bottom-24 right-6 w-48 bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="py-2">
                {sidebarContent}
              </div>
            </aside>
          )}
        </div>
      )}

      {/* 桌面端侧边栏 */}
      {!isMobile && (
        <aside className="w-64 bg-white border-r fixed h-screen pt-16">
          <div className="h-full px-4 py-6 flex flex-col">
            {sidebarContent}
            <div className="mt-auto pt-6 flex items-center justify-center">
              <div className="px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
                <span className="text-xs font-medium bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  版本 0.1.0
                </span>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
