'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <html lang="zh">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-center" />
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className={`flex-1 ${!isMobile ? 'ml-64' : ''}`}>
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
