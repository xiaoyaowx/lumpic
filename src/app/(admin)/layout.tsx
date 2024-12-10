'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAdmin } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !isAdmin(session)) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || !isAdmin(session)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
