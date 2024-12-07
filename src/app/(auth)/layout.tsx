'use client';

import '../globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <div className={inter.className + " min-h-screen bg-gray-50"}>
        {children}
      </div>
    </AuthProvider>
  );
}
