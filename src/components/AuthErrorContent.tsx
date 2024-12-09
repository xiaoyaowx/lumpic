'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  // 解码错误消息
  const decodedError = error ? decodeURIComponent(error) : '认证过程中发生错误';

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">登录失败</h2>
      <p className="text-red-600 mb-4">{decodedError}</p>
      <Link 
        href="/auth/signin" 
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        返回登录
      </Link>
    </div>
  );
}
