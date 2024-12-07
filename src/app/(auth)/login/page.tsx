'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData(e.currentTarget);
      const response = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        callbackUrl: '/',
        redirect: true,
      });
      
      // 由于设置了 redirect: true，这里的代码只会在出错时执行
      if (response?.error) {
        setError('邮箱或密码错误');
        toast.error('邮箱或密码错误');
      }
    } catch (error) {
      console.error('登录错误:', error);
      setError('系统错误，请稍后重试');
      toast.error('系统错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Decorative Image */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        {/* 背景图片 */}
        <div className="absolute inset-0">
          <Image
            src="/images/auth-bg.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* 渐变叠加层 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-blue-600/50" />
        {/* 文字内容 */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-white text-center relative z-10">
            <Logo className="justify-center text-white" size={48} />
            <p className="text-xl opacity-90 drop-shadow-lg mt-4">捕捉光影，珍存时光</p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">欢迎回到 Lumière</h2>
            <p className="mt-2 text-sm text-gray-600">登录您的账户以继续</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱地址
              </label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入邮箱地址"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                type="password"
                name="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入密码"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                ${loading ? 'opacity-75 cursor-not-allowed' : ''} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              还没有账号？{' '}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
