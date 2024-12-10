'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    name: '用户管理',
    href: '/admin/users',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    name: '标签管理',
    href: '/admin/tags',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        <line x1="7" y1="7" x2="7.01" y2="7"></line>
      </svg>
    ),
  },
  {
    name: '操作日志',
    href: '/admin/logs',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const sidebarContent = (
    <nav className="pt-5 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
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
    <aside className="w-64 bg-white border-r fixed h-screen pt-16">
      <div className="h-full px-4 py-6 flex flex-col">
        {sidebarContent}
        <div className="mt-auto pt-6 flex items-center justify-center">
          <div className="px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
            <span className="text-xs font-medium bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              管理后台
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
